// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { NetworkList, NetworksWithPagedRewards } from 'config/networks';
import {
  FallbackBondingDuration,
  FallbackEpochDuration,
  FallbackExpectedBlockTime,
  FallbackMaxElectingVoters,
  FallbackMaxNominations,
  FallbackSessionsPerEra,
} from 'consts';
import type {
  APIChainState,
  APIConstants,
  APIContextInterface,
  APIProviderProps,
} from 'contexts/Api/types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import {
  defaultApiContext,
  defaultChainState,
  defaultConsts,
} from './defaults';
import { APIController } from 'static/APIController';
import { isCustomEvent } from 'static/utils';
import type { ApiStatus } from 'static/APIController/types';
import { NotificationsController } from 'static/NotificationsController';
import { useTranslation } from 'react-i18next';

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
    getConsts();
  };

  // Connection callback. Called once `apiStatus` is `ready`.
  const getConsts = async () => {
    const { api } = APIController;

    const allPromises = [
      api.consts.staking.bondingDuration,
      api.consts.staking.maxNominations,
      api.consts.staking.sessionsPerEra,
      api.consts.electionProviderMultiPhase.maxElectingVoters,
      api.consts.babe.expectedBlockTime,
      api.consts.babe.epochDuration,
      api.consts.balances.existentialDeposit,
      api.consts.staking.historyDepth,
      api.consts.fastUnstake.deposit,
      api.consts.nominationPools.palletId,
    ];

    // DEPRECATION: Paged Rewards
    //
    // Fetch `maxExposurePageSize` instead of `maxNominatorRewardedPerValidator` for networks that
    // have paged rewards.
    if (NetworksWithPagedRewards.includes(network)) {
      allPromises.push(api.consts.staking.maxExposurePageSize);
    } else {
      allPromises.push(api.consts.staking.maxNominatorRewardedPerValidator);
    }

    // fetch constants.
    const result = await Promise.all(allPromises);

    // format constants.
    const bondDuration = result[0]
      ? new BigNumber(rmCommas(result[0].toString()))
      : FallbackBondingDuration;

    const maxNominations = result[1]
      ? new BigNumber(rmCommas(result[1].toString()))
      : FallbackMaxNominations;

    const sessionsPerEra = result[2]
      ? new BigNumber(rmCommas(result[2].toString()))
      : FallbackSessionsPerEra;

    const maxElectingVoters = result[3]
      ? new BigNumber(rmCommas(result[3].toString()))
      : FallbackMaxElectingVoters;

    const expectedBlockTime = result[4]
      ? new BigNumber(rmCommas(result[4].toString()))
      : FallbackExpectedBlockTime;

    const epochDuration = result[5]
      ? new BigNumber(rmCommas(result[5].toString()))
      : FallbackEpochDuration;

    const existentialDeposit = result[6]
      ? new BigNumber(rmCommas(result[6].toString()))
      : new BigNumber(0);

    const historyDepth = result[7]
      ? new BigNumber(rmCommas(result[7].toString()))
      : new BigNumber(0);

    const fastUnstakeDeposit = result[8]
      ? new BigNumber(rmCommas(result[8].toString()))
      : new BigNumber(0);

    const poolsPalletId = result[9] ? result[9].toU8a() : new Uint8Array(0);

    const maxExposurePageSize = result[10]
      ? new BigNumber(rmCommas(result[10].toString()))
      : NetworkList[network].maxExposurePageSize;

    setConsts({
      bondDuration,
      maxNominations,
      sessionsPerEra,
      maxExposurePageSize,
      historyDepth,
      maxElectingVoters,
      epochDuration,
      expectedBlockTime,
      poolsPalletId,
      existentialDeposit,
      fastUnstakeDeposit,
    });

    // API is now ready to be used.
    setApiStatus('ready');
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

  return (
    <APIContext.Provider
      value={{
        api: APIController.api,
        consts,
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
