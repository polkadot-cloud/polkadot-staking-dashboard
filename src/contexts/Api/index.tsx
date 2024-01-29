// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  NetworkList,
  NetworksWithPagedRewards,
  PagedRewardsStartEra,
} from 'config/networks';

import type {
  APIActiveEra,
  APIChainState,
  APIConstants,
  APIContextInterface,
  APINetworkMetrics,
  APIPoolsConfig,
  APIProviderProps,
  APIStakingMetrics,
} from './types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import {
  defaultConsts,
  defaultActiveEra,
  defaultApiContext,
  defaultChainState,
  defaultPoolsConfig,
  defaultNetworkMetrics,
  defaultStakingMetrics,
} from './defaults';
import { APIController } from 'static/APIController';
import { isCustomEvent } from 'static/utils';
import type { ApiStatus } from 'static/APIController/types';
import { NotificationsController } from 'static/NotificationsController';
import { useTranslation } from 'react-i18next';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';

export const APIContext = createContext<APIContextInterface>(defaultApiContext);

export const useApi = () => useContext(APIContext);

export const APIProvider = ({ children, network }: APIProviderProps) => {
  const { t } = useTranslation('library');

  // Store API connection status.
  const [apiStatus, setApiStatus] = useState<ApiStatus>('disconnected');

  // Store whether light client is active.
  const [isLightClient, setIsLightClientState] = useState<boolean>(
    !!localStorage.getItem('light_client')
  );

  // Setter for whether light client is active. Updates state and local storage.
  const setIsLightClient = (value: boolean) => {
    setIsLightClientState(value);
    if (!value) {
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

  const [rpcEndpoint, setRpcEndpointState] =
    useState<string>(initialRpcEndpoint());

  // Set RPC provider with local storage and validity checks.
  const setRpcEndpoint = (key: string) => {
    if (!NetworkList[network].endpoints.rpcEndpoints[key]) {
      return;
    }
    localStorage.setItem(`${network}_rpc_endpoint`, key);
    setRpcEndpointState(key);
  };

  // Store chain state.
  const [chainState, setChainState] =
    useState<APIChainState>(defaultChainState);

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

  // Fetch chain state. Called once `provider` has been initialised.
  const onApiReady = async () => {
    const { api } = APIController;

    const newChainState = await Promise.all([
      api.rpc.system.chain(),
      api.consts.system.version,
      api.consts.system.ss58Prefix,
    ]);

    // check that chain values have been fetched before committing to state.
    // could be expanded to check supported chains.
    if (newChainState.every((c) => !!c?.toHuman())) {
      const chain = newChainState[0]?.toString();
      const version = newChainState[1]?.toJSON();
      const ss58Prefix = Number(newChainState[2]?.toString());

      setChainState({ chain, version, ss58Prefix });
    }

    // Assume chain state is correct and bootstrap network consts.
    bootstrapNetworkConfig();
  };

  // Connection callback. Called once `apiStatus` is `ready`.
  const bootstrapNetworkConfig = async () => {
    const {
      consts: newConsts,
      networkMetrics: newNetworkMetrics,
      activeEra: newActiveEra,
      poolsConfig: newPoolsConfig,
      stakingMetrics: newStakingMetrics,
    } = await APIController.bootstrapNetworkConfig();

    // Populate all config state.
    setConsts(newConsts);
    setStateWithRef(newNetworkMetrics, setNetworkMetrics, networkMetricsRef);
    const { index, start } = newActiveEra;
    setStateWithRef(
      { index: new BigNumber(index), start: new BigNumber(start) },
      setActiveEra,
      activeEraRef
    );
    setStateWithRef(newPoolsConfig, setPoolsConfig, poolsConfigRef);
    setStateWithRef(newStakingMetrics, setStakingMetrics, stakingMetricsRef);

    // API is now ready to be used.
    setApiStatus('ready');

    // Initialise subscriptions.
    APIController.subscribeNetworkMetrics();
    APIController.subscribePoolsConfig();
    APIController.subscribeActiveEra();
  };

  const onApiDisconnected = (err?: string) => {
    setApiStatus('disconnected');

    // Trigger a notification if this disconnect is a result of an offline error.
    if (err === 'offline-event') {
      NotificationsController.emit({
        title: t('disconnected'),
        subtitle: t('connectionLost'),
      });

      // Start attempting reconnects.
      APIController.initialize(
        network,
        isLightClient ? 'sc' : 'ws',
        rpcEndpoint
      );
    }
  };

  // Handle `polkadot-api` events.
  const eventCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { event, err } = e.detail;

      switch (event) {
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
          onApiDisconnected(err);
          break;
        case 'error':
          onApiDisconnected(err);
          break;
      }
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

  // Given an era, determine whether paged rewards are active.
  const isPagedRewardsActive = (era: BigNumber): boolean => {
    const networkStartEra = PagedRewardsStartEra[network];
    if (!networkStartEra) {
      return false;
    }
    return (
      NetworksWithPagedRewards.includes(network) &&
      era.isGreaterThanOrEqualTo(networkStartEra)
    );
  };

  // Handle an initial api connection.
  useEffect(() => {
    if (!APIController.provider) {
      APIController.initialize(
        network,
        isLightClient ? 'sc' : 'ws',
        rpcEndpoint,
        {
          initial: true,
        }
      );
    }
  });

  // If RPC endpoint changes, and not on light client, re-connect.
  useEffectIgnoreInitial(() => {
    if (!isLightClient) {
      APIController.initialize(network, 'ws', rpcEndpoint);
    }
  }, [rpcEndpoint]);

  // Trigger API reconnect on network or light client change.
  useEffectIgnoreInitial(() => {
    setRpcEndpoint(initialRpcEndpoint());
    // If network changes, reset consts and chain state.
    if (network !== APIController.network) {
      setConsts(defaultConsts);
      setChainState(defaultChainState);
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
    }
    // Reconnect API instance.
    APIController.initialize(network, isLightClient ? 'sc' : 'ws', rpcEndpoint);
  }, [isLightClient, network]);

  // Add event listener for `polkadot-api` notifications. Also handles unmounting logic.
  useEffect(() => {
    document.addEventListener('polkadot-api', eventCallback);
    return () => {
      document.removeEventListener('polkadot-api', eventCallback);
      APIController.cancelFn?.();
      APIController.unsubscribe();
    };
  }, []);

  // Add event listener for subscription updates.
  const documentRef = useRef<Document>(document);

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
        api: APIController.api,
        chainState,
        apiStatus,
        isLightClient,
        setIsLightClient,
        rpcEndpoint,
        setRpcEndpoint,
        isReady: apiStatus === 'ready',
        consts,
        networkMetrics,
        activeEra,
        poolsConfig,
        stakingMetrics,
        isPagedRewardsActive,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
