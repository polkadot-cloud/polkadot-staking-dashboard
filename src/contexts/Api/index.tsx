// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { NetworkList } from 'config/networks';

import type {
  APIChainState,
  APIConstants,
  APIContextInterface,
  APIProviderProps,
  NetworkMetrics,
} from 'contexts/Api/types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import {
  defaultApiContext,
  defaultChainState,
  defaultConsts,
  defaultNetworkMetrics,
} from './defaults';
import { APIController } from 'static/APIController';
import { isCustomEvent } from 'static/utils';
import type { ApiStatus } from 'static/APIController/types';
import { NotificationsController } from 'static/NotificationsController';
import { useTranslation } from 'react-i18next';
import { useEventListener } from 'usehooks-ts';

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
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>(
    defaultNetworkMetrics
  );
  const networkMetricsRef = useRef(networkMetrics);

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
    const { consts: newConsts, networkMetrics: newNetworkMetrics } =
      await APIController.bootstrapNetworkConfig();

    setStateWithRef(newNetworkMetrics, setNetworkMetrics, networkMetricsRef);
    setConsts(newConsts);

    // API is now ready to be used.
    setApiStatus('ready');

    // Handle network metrics subscription.
    APIController.subscribeNetworkMetrics();
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
  const handleNetworkMetricsUpdate = (e: Event) => {
    if (isCustomEvent(e)) {
      const { networkMetrics: newNetworkMetrics } = e.detail;
      // Only update network metrics if values have changed.
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
      setNetworkMetrics(defaultNetworkMetrics);
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

  // Add event listener for network metrics updates.
  const documentRef = useRef<Document>(document);

  useEventListener(
    'new-network-metrics',
    handleNetworkMetricsUpdate,
    documentRef
  );

  return (
    <APIContext.Provider
      value={{
        api: APIController.api,
        consts,
        networkMetrics,
        chainState,
        apiStatus,
        isLightClient,
        setIsLightClient,
        rpcEndpoint,
        setRpcEndpoint,
        isReady: apiStatus === 'ready',
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
