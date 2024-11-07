// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { NetworkList } from 'config/networks';

import type {
  APIActiveEra,
  APIConstants,
  APIContextInterface,
  APINetworkMetrics,
  APIPoolsConfig,
  APIProviderProps,
  APIStakingMetrics,
} from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import {
  defaultConsts,
  defaultActiveEra,
  defaultApiContext,
  defaultPoolsConfig,
  defaultNetworkMetrics,
  defaultStakingMetrics,
  defaultChainSpecs,
} from './defaults';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';
import { SyncController } from 'controllers/Sync';
import { ApiController } from 'controllers/Api';
import type {
  APIEventDetail,
  ApiStatus,
  ConnectionType,
  PAPIChainSpecs,
} from 'model/Api/types';
import { Era } from 'model/Query/Era';
import { NetworkMeta } from 'model/Query/NetworkMeta';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/Subscribe/BlockNumber';
import { NetworkMetrics } from 'model/Subscribe/NetworkMetrics';
import { ActiveEra } from 'model/Subscribe/ActiveEra';
import { PoolsConfig } from 'model/Subscribe/PoolsConfig';
import { SmoldotController } from 'controllers/Smoldot';

export const APIContext = createContext<APIContextInterface>(defaultApiContext);

export const useApi = () => useContext(APIContext);

export const APIProvider = ({ children, network }: APIProviderProps) => {
  // Store Api connection status for the current network.
  const [apiStatus, setApiStatus] = useState<ApiStatus>('disconnected');

  // Store Api connection status for People system chain.
  const [peopleApiStatus, setPeopleApiStatus] =
    useState<ApiStatus>('disconnected');

  // Store whether light client is active.
  const [connectionType, setConnectionTypeState] = useState<ConnectionType>(
    localStorage.getItem('light_client') ? 'sc' : 'ws'
  );
  const connectionTypeRef = useRef(connectionType);

  // Whether this context has initialised.
  const initialisedRef = useRef<boolean>(false);

  // Setter for whether light client is active. Updates state and local storage.
  const setConnectionType = (value: ConnectionType) => {
    if (value === 'ws') {
      SmoldotController.terminate();
      localStorage.removeItem('light_client');
    } else {
      localStorage.setItem('light_client', 'true');
    }
    connectionTypeRef.current = value;
    setConnectionTypeState(value);
  };

  // Store the active RPC provider.
  const initialRpcEndpoint = () => {
    const local = localStorage.getItem(`${network}_rpc_endpoint`);
    if (local) {
      if (NetworkList[network].endpoints.rpcEndpoints[local]) {
        return local;
      } else {
        localStorage.removeItem(`${network}_rpc_endpoint`);
      }
    }
    return NetworkList[network].endpoints.defaultRpcEndpoint;
  };

  // The current RPC endpoint for the network.
  const [rpcEndpoint, setRpcEndpointState] =
    useState<string>(initialRpcEndpoint());
  const rpcEndpointRef = useRef(rpcEndpoint);

  // Set RPC provider with local storage and validity checks.
  const setRpcEndpoint = (key: string) => {
    if (!NetworkList[network].endpoints.rpcEndpoints[key]) {
      return;
    }
    localStorage.setItem(`${network}_rpc_endpoint`, key);
    rpcEndpointRef.current = key;
    setRpcEndpointState(key);
  };

  // Store network constants. Set in an event callback - ref also needed.
  const [consts, setConstsState] = useState<APIConstants>(defaultConsts);
  const constsRef = useRef(consts);

  const setConsts = (newConsts: APIConstants) => {
    setStateWithRef(newConsts, setConstsState, constsRef);
  };

  // Store network metrics in state.
  const [networkMetrics, setNetworkMetrics] = useState<APINetworkMetrics>(
    defaultNetworkMetrics
  );
  const networkMetricsRef = useRef(networkMetrics);

  // Store active era in state.
  const [activeEra, setActiveEra] = useState<APIActiveEra>(defaultActiveEra);
  const activeEraRef = useRef(activeEra);

  // Store pool config in state.
  const [poolsConfig, setPoolsConfig] =
    useState<APIPoolsConfig>(defaultPoolsConfig);
  const poolsConfigRef = useRef(poolsConfig);

  // Store staking metrics in state.
  const [stakingMetrics, setStakingMetrics] = useState<APIStakingMetrics>(
    defaultStakingMetrics
  );

  const [chainSpecs, setChainSpecs] = useState<
    PAPIChainSpecs & { received: boolean }
  >(defaultChainSpecs);

  const stakingMetricsRef = useRef(stakingMetrics);

  // Fetch chain state. Called once `provider` has been initialised.
  const onApiReady = async () => {
    // Assume chain state is correct and bootstrap network consts.
    bootstrapNetworkConfig();
  };

  // Bootstrap app-wide chain state.
  const bootstrapNetworkConfig = async () => {
    const apiInstance = ApiController.get(network);
    const api = apiInstance.api;

    // 1. Fetch network data for bootstrapping app state:

    // Get active and previous era.
    const { activeEra: newActiveEra, previousEra } = await new Era().fetch(api);

    // Get network meta data related to staking and pools.
    const {
      networkMetrics: newNetworkMetrics,
      poolsConfig: newPoolsConfig,
      stakingMetrics: newStakingMetrics,
    } = await new NetworkMeta().fetch(api, newActiveEra, previousEra);

    // 2. Populate all config state:

    setStateWithRef(newNetworkMetrics, setNetworkMetrics, networkMetricsRef);
    const { index, start } = newActiveEra;
    setStateWithRef({ index, start }, setActiveEra, activeEraRef);
    setStateWithRef(newPoolsConfig, setPoolsConfig, poolsConfigRef);
    setStateWithRef(newStakingMetrics, setStakingMetrics, stakingMetricsRef);

    // API is now ready to be used.
    setApiStatus('ready');

    // Set `initialization` syncing to complete. NOTE: This synchonisation is only considering the
    // relay chain sync state, and not system/para chains.
    SyncController.dispatch('initialization', 'complete');

    // 3. Initialise subscriptions:

    // Initialise block number subscription.
    SubscriptionsController.set(
      network,
      'blockNumber',
      new BlockNumber(network)
    );

    // Initialise network metrics subscription.
    SubscriptionsController.set(
      network,
      'networkMetrics',
      new NetworkMetrics(network)
    );

    // Initialise pool config subscription.
    SubscriptionsController.set(
      network,
      'poolsConfig',
      new PoolsConfig(network)
    );

    // Initialise active era subscription. Also handles (re)subscribing to subscriptions that depend
    // on active era.
    SubscriptionsController.set(network, 'activeEra', new ActiveEra(network));
  };

  // Handle `polkadot-api` events.
  const handleNewApiStatus = (e: Event) => {
    if (isCustomEvent(e)) {
      const { chainType } = e.detail;

      if (chainType === 'relay') {
        handleRelayApiStatus(e.detail);
      } else if (chainType === 'system') {
        handleSystemApiStatus(e.detail);
      }
    }
  };

  const handlePapiReady = (e: Event) => {
    if (isCustomEvent(e)) {
      const { chainType, chain, specs, ss58Prefix } = e.detail;
      // We are only interested in the Relay chain.
      if (chainType === 'relay') {
        const newChainSpecs = {
          chain,
          specs,
          ss58Prefix,
        };
        setChainSpecs({ ...newChainSpecs, received: true });

        // Fetch chain constants. NOTE: Once we go chain agnostic default values can be removed in
        // favour of throwing an error that'll need UI.
        const apiInstance = ApiController.get(network);

        const bondingDuration = apiInstance.getConstant(
          'Staking',
          'BondingDuration',
          28
        );
        const sessionsPerEra = apiInstance.getConstant(
          'Staking',
          'SessionsPerEra',
          6
        );
        const maxExposurePageSize = apiInstance.getConstant(
          'Staking',
          'MaxExposurePageSize',
          NetworkList[network].maxExposurePageSize
        );
        const historyDepth = apiInstance.getConstant(
          'Staking',
          'HistoryDepth',
          84
        );
        const expectedBlockTime = apiInstance.getConstant(
          'Babe',
          'ExpectedBlockTime',
          6000
        );
        const epochDuration = apiInstance.getConstant(
          'Babe',
          'EpochDuration',
          2400
        );
        const existentialDeposit = apiInstance.getConstant(
          'Balances',
          'ExistentialDeposit',
          0
        );
        const fastUnstakeDeposit = apiInstance.getConstant(
          'FastUnstake',
          'Deposit',
          0
        );
        const poolsPalletId = apiInstance.getConstant(
          'NominationPools',
          'PalletId',
          new Uint8Array(0),
          'asBytes'
        );

        setConsts({
          maxNominations: new BigNumber(16),
          bondDuration: new BigNumber(bondingDuration),
          sessionsPerEra: new BigNumber(sessionsPerEra),
          maxExposurePageSize: new BigNumber(maxExposurePageSize),
          historyDepth: new BigNumber(historyDepth),
          expectedBlockTime: new BigNumber(expectedBlockTime.toString()),
          epochDuration: new BigNumber(epochDuration.toString()),
          existentialDeposit: new BigNumber(existentialDeposit.toString()),
          fastUnstakeDeposit: new BigNumber(fastUnstakeDeposit.toString()),
          poolsPalletId,
        });
      }
    }
  };

  // Handle an Api status event for a relay chain.
  const handleRelayApiStatus = (detail: APIEventDetail) => {
    const {
      status,
      network: eventNetwork,
      connectionType: eventConnectionType,
      rpcEndpoint: eventRpcEndpoint,
    } = detail;

    // UI is only interested in events for the current network.
    if (
      eventNetwork !== network ||
      connectionTypeRef.current !== eventConnectionType ||
      rpcEndpointRef.current !== eventRpcEndpoint
    ) {
      return;
    }
    switch (status) {
      case 'ready':
        onApiReady();
        break;
      case 'connecting':
        setApiStatus('connecting');
        break;
      case 'connected':
        setApiStatus('connected');
        break;
      case 'disconnected':
        setApiStatus('disconnected');
        break;
      case 'error':
        // Reinitialise api on error. We can confidently do this with well-known RPC providers,
        // but not with custom endpoints.
        reInitialiseApi(eventConnectionType);
        break;
    }
  };

  // Handle an Api status event for a system chain. NOTE: Only People chain is currently being used.
  const handleSystemApiStatus = (detail: APIEventDetail) => {
    const {
      status,
      network: eventNetwork,
      connectionType: eventConnectionType,
    } = detail;

    // UI is only interested in events for the People system chain.
    if (
      eventNetwork !== `people-${network}` ||
      connectionTypeRef.current !== eventConnectionType
      /* || rpcEndpointRef.current !== eventRpcEndpoint // NOTE: Only `Parity` being used currently. */
    ) {
      return;
    }
    switch (status) {
      case 'ready':
        setPeopleApiStatus('ready');
        break;
      case 'connecting':
        setPeopleApiStatus('connecting');
        break;
      case 'connected':
        setPeopleApiStatus('connected');
        break;
      case 'disconnected':
        setPeopleApiStatus('disconnected');
        break;
      case 'error':
        // Silently fail.
        break;
    }
  };

  // Handle new network metrics updates.
  const handleNetworkMetricsUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { networkMetrics: newNetworkMetrics } = e.detail;
      // Only update if values have changed.
      if (
        JSON.stringify(newNetworkMetrics) !==
        JSON.stringify(networkMetricsRef.current)
      ) {
        setStateWithRef(
          {
            ...networkMetricsRef.current,
            ...newNetworkMetrics,
          },
          setNetworkMetrics,
          networkMetricsRef
        );
      }
    }
  };

  // Handle new active era updates.
  const handleActiveEraUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      let { activeEra: newActiveEra } = e.detail;
      const { index, start } = newActiveEra;
      if (index === 0 || !start) {
        return;
      }
      newActiveEra = {
        index: new BigNumber(index),
        start: new BigNumber(start),
      };

      // Only update if values have changed.
      if (
        JSON.stringify(newActiveEra) !== JSON.stringify(activeEraRef.current)
      ) {
        setStateWithRef(
          {
            index: new BigNumber(index),
            start: new BigNumber(start),
          },
          setActiveEra,
          activeEraRef
        );
      }
    }
  };

  // Handle new pools config updates.
  const handlePoolsConfigUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { poolsConfig: newPoolsConfig } = e.detail;
      // Only update if values have changed.
      if (
        JSON.stringify(newPoolsConfig) !==
        JSON.stringify(poolsConfigRef.current)
      ) {
        setStateWithRef(
          {
            ...poolsConfigRef.current,
            ...newPoolsConfig,
          },
          setPoolsConfig,
          poolsConfigRef
        );
      }
    }
  };

  // Handle new staking metrics updates.
  const handleStakingMetricsUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { stakingMetrics: newStakingMetrics } = e.detail;
      // Only update if values have changed.
      if (
        JSON.stringify(newStakingMetrics) !==
        JSON.stringify(stakingMetricsRef.current)
      ) {
        setStateWithRef(
          {
            ...stakingMetricsRef.current,
            ...newStakingMetrics,
          },
          setStakingMetrics,
          stakingMetricsRef
        );
      }
    }
  };

  const reInitialiseApi = async (type: ConnectionType) => {
    setApiStatus('disconnected');

    // Dispatch all default syncIds as syncing.
    SyncController.dispatchAllDefault();

    // Instanaite new API instance.
    await ApiController.instantiate(network, type, rpcEndpoint);
  };

  // Handle initial api connection.
  useEffect(() => {
    // Uses initialisation ref to check whether this is the first context render, and initializes an Api instance for the current network if that is the case.
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      reInitialiseApi(connectionType);
    }
  });

  // If RPC endpoint changes, and not on light client, re-initialise API.
  useEffectIgnoreInitial(async () => {
    if (connectionType !== 'sc') {
      reInitialiseApi('ws');
    }
  }, [rpcEndpoint]);

  // If connection type changes, re-initialise API.
  useEffectIgnoreInitial(async () => {
    reInitialiseApi(connectionType);
  }, [connectionType]);

  // Re-initialise API and set defaults on network change.
  useEffectIgnoreInitial(() => {
    setRpcEndpoint(initialRpcEndpoint());

    // Reset consts and chain state.
    setConsts(defaultConsts);
    setChainSpecs(defaultChainSpecs);
    setStateWithRef(
      defaultNetworkMetrics,
      setNetworkMetrics,
      networkMetricsRef
    );
    setStateWithRef(defaultActiveEra, setActiveEra, activeEraRef);
    setStateWithRef(defaultPoolsConfig, setPoolsConfig, poolsConfigRef);
    setStateWithRef(
      defaultStakingMetrics,
      setStakingMetrics,
      stakingMetricsRef
    );

    reInitialiseApi(connectionType);
  }, [network]);

  // Call `unsubscribe` on active instnace on unmount.
  useEffect(
    () => () => {
      const instance = ApiController.get(network);
      instance?.unsubscribe();
    },
    []
  );

  // Add event listener for api events and subscription updates.
  const documentRef = useRef<Document>(document);
  useEventListener('papi-ready', handlePapiReady, documentRef);
  useEventListener('api-status', handleNewApiStatus, documentRef);
  useEventListener(
    'new-network-metrics',
    handleNetworkMetricsUpdate,
    documentRef
  );
  useEventListener('new-active-era', handleActiveEraUpdate, documentRef);
  useEventListener('new-pools-config', handlePoolsConfigUpdate, documentRef);
  useEventListener(
    'new-staking-metrics',
    handleStakingMetricsUpdate,
    documentRef
  );

  return (
    <APIContext.Provider
      value={{
        api: ApiController.get(network)?.api || null,
        peopleApi: ApiController.get(`people-${network}`)?.api || null,
        chainSpecs,
        apiStatus,
        peopleApiStatus,
        connectionType,
        setConnectionType,
        rpcEndpoint,
        setRpcEndpoint,
        isReady: apiStatus === 'ready' && chainSpecs.received === true,
        consts,
        networkMetrics,
        activeEra,
        poolsConfig,
        stakingMetrics,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
