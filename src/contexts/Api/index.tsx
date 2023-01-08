// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import BN from 'bn.js';
import { NETWORKS } from 'config/networks';
import {
  ApiEndpoints,
  FallbackBondingDuration,
  FallbackEpochDuration,
  FallbackExpectedBlockTime,
  FallbackMaxElectingVoters,
  FallbackMaxNominations,
  FallbackNominatorRewardedPerValidator,
  FallbackSessionsPerEra,
} from 'consts';
import {
  APIConstants,
  APIContextInterface,
  ConnectionStatus,
  NetworkState,
} from 'contexts/Api/types';
import React, { useEffect, useState } from 'react';
import { AnyApi, Network, NetworkName } from 'types';
import { isNetworkFromMetaTags } from 'Utils';
import * as defaults from './defaults';

export const APIContext = React.createContext<APIContextInterface>(
  defaults.defaultApiContext
);

export const useApi = () => React.useContext(APIContext);

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  // provider instance state
  const [provider, setProvider] = useState<WsProvider | ScProvider | null>(
    null
  );

  // api instance state
  const [api, setApi] = useState<ApiPromise | null>(null);

  // network state
  const _name: NetworkName =
    (localStorage.getItem('network') as NetworkName) ?? 'polkadot';

  // store the currently active network
  const [network, setNetwork] = useState<NetworkState>({
    name: _name,
    meta: NETWORKS[localStorage.getItem('network') as NetworkName],
  });

  // constants state
  const [consts, setConsts] = useState<APIConstants>(defaults.consts);

  // connection status state
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');

  const [isLightClient, setIsLightClient] = useState<boolean>(
    !!localStorage.getItem('isLightClient')
  );

  // initial connection
  useEffect(() => {
    if (!provider) {
      const _network: NetworkName = localStorage.getItem(
        'network'
      ) as NetworkName;
      connect(_network, isLightClient);
    }
  });

  // provider event handlers
  useEffect(() => {
    if (provider !== null) {
      provider.on('connected', () => {
        setConnectionStatus('connected');
      });
      provider.on('error', () => {
        setConnectionStatus('disconnected');
      });
      connectedCallback(provider);
    }
  }, [provider]);

  // connection callback
  const connectedCallback = async (_provider: WsProvider | ScProvider) => {
    const _api = await ApiPromise.create({ provider: _provider });

    // update connection status
    setConnectionStatus('connected');

    // put active network in localStorage
    localStorage.setItem('network', String(network.name));

    // constants
    const promises = [
      _api.consts.staking.bondingDuration,
      _api.consts.staking.maxNominations,
      _api.consts.staking.sessionsPerEra,
      _api.consts.staking.maxNominatorRewardedPerValidator,
      _api.consts.electionProviderMultiPhase.maxElectingVoters,
      _api.consts.babe.expectedBlockTime,
      _api.consts.babe.epochDuration,
      _api.consts.balances.existentialDeposit,
      _api.consts.staking.historyDepth,
      _api.consts.nominationPools.palletId,
    ];

    // fetch constants
    const _consts: AnyApi = await Promise.all(promises);

    // format constants
    const bondDuration = _consts[0]
      ? Number(_consts[0].toString())
      : FallbackBondingDuration;

    const maxNominations = _consts[1]
      ? Number(_consts[1].toString())
      : FallbackMaxNominations;

    const sessionsPerEra = _consts[2]
      ? Number(_consts[2].toString())
      : FallbackSessionsPerEra;

    const maxNominatorRewardedPerValidator = _consts[3]
      ? Number(_consts[3].toString())
      : FallbackNominatorRewardedPerValidator;

    const maxElectingVoters = _consts[4]
      ? Number(_consts[4].toString())
      : FallbackMaxElectingVoters;

    const expectedBlockTime = _consts[5]
      ? Number(_consts[5].toString())
      : FallbackExpectedBlockTime;

    const epochDuration = _consts[6]
      ? Number(_consts[6].toString())
      : FallbackEpochDuration;

    const existentialDeposit = _consts[7]
      ? new BN(_consts[7].toString())
      : new BN(0);

    const historyDepth = _consts[8] ? new BN(_consts[8].toString()) : new BN(0);
    const poolsPalletId = _consts[9] ? _consts[9].toU8a() : new Uint8Array(0);

    setApi(_api);
    setConsts({
      bondDuration,
      maxNominations,
      sessionsPerEra,
      maxNominatorRewardedPerValidator,
      historyDepth,
      maxElectingVoters,
      epochDuration,
      expectedBlockTime,
      poolsPalletId,
      existentialDeposit,
    });
  };

  // connect function sets provider and updates active network.
  const connect = async (_network: NetworkName, _isLightClient?: boolean) => {
    const nodeEndpoint: Network = NETWORKS[_network];
    const { endpoints } = nodeEndpoint;

    let _provider: WsProvider | ScProvider;
    if (_isLightClient) {
      _provider = new ScProvider(endpoints.lightClient);
      await _provider.connect();
    } else {
      _provider = new WsProvider(endpoints.rpc);
    }

    setProvider(_provider);
    setNetwork({
      name: _network,
      meta: NETWORKS[_network],
    });
  };

  // Update head meta tags to reflect the current network.
  //
  // Determines if icons need to be updated and the current network in place. Iterates icons and
  // updates network paths for icons. Updates theme color and ms title color.
  const updateIconMetaTags = (name: NetworkName) => {
    try {
      const icons = document.querySelectorAll("link[rel*='icon']");

      let current = '';
      if (icons[0]) {
        Object.values(NETWORKS).every((n: Network) => {
          if (isNetworkFromMetaTags(n.name as NetworkName)) {
            current = n.name.toLowerCase();
            return false;
          }
          return true;
        });
      }

      // if current network is determined, commit network update in `href` values.
      if (current.length) {
        icons.forEach((e) => {
          const href = e.getAttribute('href');
          if (href) {
            e.setAttribute('href', href.replace(current, name.toLowerCase()));
          }
        });
        // TODO: add colors as parameters
        document
          .querySelector("meta[name='msapplication-TileColor']")
          ?.setAttribute('content', '#e6007a');
        document
          .querySelector("meta[name='theme-color']")
          ?.setAttribute('content', '#fff');
      }
    } catch (e) {
      /* error */
    }
  };

  // handle network switching
  const switchNetwork = async (
    _network: NetworkName,
    _isLightClient: boolean
  ) => {
    localStorage.setItem('isLightClient', _isLightClient ? 'true' : '');
    setIsLightClient(_isLightClient);
    // disconnect api if not null
    if (api) {
      await api.disconnect();
    }
    setApi(null);
    updateIconMetaTags(_network);
    setConnectionStatus('connecting');
    connect(_network, _isLightClient);
  };

  // handles fetching of DOT price and updates context state.
  const fetchDotPrice = async () => {
    const urls = [
      `${ApiEndpoints.priceChange}${NETWORKS[network.name].api.priceTicker}`,
    ];
    const responses = await Promise.all(
      urls.map((u) => fetch(u, { method: 'GET' }))
    );
    const texts = await Promise.all(responses.map((res) => res.json()));
    const _change = texts[0];

    if (
      _change.lastPrice !== undefined &&
      _change.priceChangePercent !== undefined
    ) {
      const price: string = (Math.ceil(_change.lastPrice * 100) / 100).toFixed(
        2
      );
      const change: string = (
        Math.round(_change.priceChangePercent * 100) / 100
      ).toFixed(2);

      return {
        lastPrice: price,
        change,
      };
    }
    return null;
  };

  return (
    <APIContext.Provider
      value={{
        connect,
        fetchDotPrice,
        switchNetwork,
        api,
        consts,
        isReady: connectionStatus === 'connected' && api !== null,
        network: network.meta,
        status: connectionStatus,
        isLightClient,
        updateIconMetaTags,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
