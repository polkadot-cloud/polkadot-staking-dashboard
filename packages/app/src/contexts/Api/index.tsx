// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { NetworkList } from 'config/networks';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { Era, NetworkMeta } from 'api/query';
import { ActiveEra } from 'api/subscribe/activeEra';
import { BlockNumber } from 'api/subscribe/blockNumber';
import { NetworkMetrics } from 'api/subscribe/networkMetrics';
import { PoolsConfig } from 'api/subscribe/poolsConfig';
import type { APIEventDetail, ApiStatus, ConnectionType } from 'api/types';
import BigNumber from 'bignumber.js';
import { Apis } from 'controllers/Apis';
import { Subscriptions } from 'controllers/Subscriptions';
import { Syncs } from 'controllers/Syncs';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import {
  defaultActiveEra,
  defaultApiContext,
  defaultChainSpecs,
  defaultConsts,
  defaultNetworkMetrics,
  defaultPoolsConfig,
  defaultStakingMetrics,
} from './defaults';
import type {
  APIActiveEra,
  APIConstants,
  APIContextInterface,
  APINetworkMetrics,
  APIPoolsConfig,
  APIProviderProps,
  APIStakingMetrics,
  PapiChainSpecContext,
} from './types';

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
    connectionTypeRef.current = value;
    setConnectionTypeState(value);

    if (value === 'ws') {
      localStorage.removeItem('light_client');
      return;
    }
    localStorage.setItem('light_client', 'true');
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

  // Store network constants.
  const [consts, setConsts] = useState<APIConstants>(defaultConsts);

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
  const stakingMetricsRef = useRef(stakingMetrics);

  // Store chain specs from PAPI.
  const [chainSpecs, setChainSpecs] =
    useState<PapiChainSpecContext>(defaultChainSpecs);

  // Bootstrap app-wide chain state.
  const bootstrapNetworkConfig = async () => {
    // 1. Fetch network data for bootstrapping app state:

    // Get active and previous era.
    const { activeEra: newActiveEra, previousEra } = await new Era(
      network
    ).fetch();

    // Get network meta data related to staking and pools.
    const {
      networkMetrics: newNetworkMetrics,
      poolsConfig: newPoolsConfig,
      stakingMetrics: newStakingMetrics,
    } = await new NetworkMeta(network).fetch(newActiveEra, previousEra);

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
    Syncs.dispatch('initialization', 'complete');

    // 3. Initialise subscriptions:

    // Initialise block number subscription.
    Subscriptions.set(network, 'blockNumber', new BlockNumber(network));

    // Initialise network metrics subscription.
    Subscriptions.set(network, 'networkMetrics', new NetworkMetrics(network));

    // Initialise pool config subscription.
    Subscriptions.set(network, 'poolsConfig', new PoolsConfig(network));

    // Initialise active era subscription. Also handles (re)subscribing to subscriptions that depend
    // on active era.
    Subscriptions.set(network, 'activeEra', new ActiveEra(network));
  };

  const handlePapiReady = async (e: Event) => {
    if (isCustomEvent(e)) {
      const {
        chainType,
        genesisHash,
        ss58Format,
        tokenDecimals,
        tokenSymbol,
        authoringVersion,
        implName,
        implVersion,
        specName,
        specVersion,
        stateVersion,
        transactionVersion,
      } = e.detail;

      if (chainType === 'relay') {
        const newChainSpecs: PapiChainSpecContext = {
          genesisHash,
          ss58Format,
          tokenDecimals,
          tokenSymbol,
          authoringVersion,
          implName,
          implVersion,
          specName,
          specVersion,
          stateVersion,
          transactionVersion,
          received: true,
        };

        const api = Apis.get(network);
        const bondingDuration = await api.getConstant(
          'Staking',
          'BondingDuration',
          0
        );
        const sessionsPerEra = await api.getConstant(
          'Staking',
          'SessionsPerEra',
          0
        );
        const maxExposurePageSize = await api.getConstant(
          'Staking',
          'MaxExposurePageSize',
          0
        );
        const historyDepth = await api.getConstant(
          'Staking',
          'HistoryDepth',
          0
        );
        const expectedBlockTime = await api.getConstant(
          'Babe',
          'ExpectedBlockTime',
          0
        );
        const epochDuration = await api.getConstant('Babe', 'EpochDuration', 0);
        const existentialDeposit = await api.getConstant(
          'Balances',
          'ExistentialDeposit',
          0
        );
        const fastUnstakeDeposit = await api.getConstant(
          'FastUnstake',
          'Deposit',
          0
        );
        const poolsPalletId = await api.getConstant(
          'NominationPools',
          'PalletId',
          new Uint8Array(0),
          'asBytes'
        );

        setChainSpecs({ ...newChainSpecs, received: true });

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

        bootstrapNetworkConfig();
      }
    }
  };

  // Handle api status events.
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
    Syncs.dispatchAllDefault();

    // Instanaite new API instance.
    await Apis.instantiate(network, type, rpcEndpoint);
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
    setChainSpecs(defaultChainSpecs);
    setConsts(defaultConsts);
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

  // Call `unsubscribe` on active instance on unmount.
  useEffect(
    () => () => {
      const instance = Apis.get(network);
      instance?.unsubscribe();
    },
    []
  );

  // Add event listener for api events and subscription updates.
  const documentRef = useRef<Document>(document);
  useEventListener('api-status', handleNewApiStatus, documentRef);
  useEventListener('api-ready', handlePapiReady, documentRef);
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
