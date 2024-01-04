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
  ApiStatus,
} from 'contexts/Api/types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import {
  defaultApiContext,
  defaultChainState,
  defaultConsts,
} from './defaults';
import { APIController } from 'static/APController';
import { isCustomEvent } from 'static/utils';

export const APIContext = createContext<APIContextInterface>(defaultApiContext);

export const useApi = () => useContext(APIContext);

export const APIProvider = ({ children, network }: APIProviderProps) => {
  // Store chain state.
  const [chainState, setchainState] =
    useState<APIChainState>(defaultChainState);

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

  // Store whether in light client mode.
  const [isLightClient, setIsLightClient] = useState<boolean>(
    !!localStorage.getItem('light_client')
  );

  // Store network constants.
  const [consts, setConsts] = useState<APIConstants>(defaultConsts);

  // Store API connection status.
  const [apiStatus, setApiStatus] = useState<ApiStatus>('disconnected');

  // Set RPC provider with local storage and validity checks.
  const setRpcEndpoint = (key: string) => {
    if (!NetworkList[network].endpoints.rpcEndpoints[key]) {
      return;
    }
    localStorage.setItem(`${network}_rpc_endpoint`, key);

    setRpcEndpointState(key);
  };

  // Resets app state when switching networks.
  const onChangeNetwork = () => {
    setConsts(defaultConsts);
    setchainState(defaultChainState);
  };

  // Fetch chain state. Called once `provider` has been initialised.
  const onApiReady = async () => {
    const { api } = APIController;

    // API is now ready to be used.
    setApiStatus('ready');

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

      setchainState({ chain, version, ss58Prefix });
    }

    // store active network in localStorage.
    // NOTE: this should ideally refer to above `chain` value.
    localStorage.setItem('network', String(network));

    // Assume chain state is correct and bootstrap network consts.
    connectedCallback();
  };

  // Connection callback. Called once `provider` and `api` have been initialised.
  const connectedCallback = async () => {
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
  };

  // Handle `polkadot-api` events.
  const eventCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { event } = e.detail;

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
          setApiStatus('disconnected');
          break;
        case 'error':
          setApiStatus('disconnected');
          break;
      }
    }
  };

  // Handle an initial RPC connection.
  useEffect(() => {
    if (!APIController.provider && !isLightClient) {
      APIController.initialize(network, 'ws', { rpcEndpoint });
    }
  });

  // If RPC endpoint changes, and not on light client, re-connect.
  useEffectIgnoreInitial(() => {
    if (!isLightClient) {
      APIController.reconnect(network, 'ws', rpcEndpoint);
    }
  }, [rpcEndpoint]);

  // Trigger API connection handler on network or light client change.
  useEffectIgnoreInitial(() => {
    setRpcEndpoint(initialRpcEndpoint());

    if (network !== APIController.network) {
      onChangeNetwork();
    }

    APIController.reconnect(network, isLightClient ? 'sc' : 'ws', rpcEndpoint);

    return () => {
      APIController.cancelFn?.();
    };
  }, [isLightClient, network]);

  // Add event listener for `polkadot-api` notifications.
  useEffect(() => {
    document.addEventListener('polkadot-api', eventCallback);
    return () => {
      document.removeEventListener('polkadot-api', eventCallback);
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
