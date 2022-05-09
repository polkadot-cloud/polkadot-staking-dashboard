// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  CONNECTION_STATUS,
  BONDING_DURATION,
  SESSIONS_PER_ERA,
  MAX_NOMINATOR_REWARDED_PER_VALIDATOR,
  MAX_NOMINATIONS,
  API_ENDPOINTS,
  NODE_ENDPOINTS,
} from '../constants';

type NetworkOptions = 'polkadot' | 'westend';

export const APIContext: any = React.createContext({
  connect: () => { },
  fetchDotPrice: () => { },
  switchNetwork: () => { },
  api: null,
  consts: {},
  isReady: false,
  status: CONNECTION_STATUS[0],
});

export const useApi = () => React.useContext(APIContext);

export const APIProvider = (props: any) => {

  // provider instance state
  const [provider, setProvider]: any = useState(null);

  // api instance state
  const [api, setApi]: any = useState(null);

  // network state
  const [network, setNetwork]: any = useState({
    name: localStorage.getItem('network'),
    meta: NODE_ENDPOINTS[localStorage.getItem('network') as keyof NetworkOptions],
  });

  // constants state
  const [consts, setConsts]: any = useState({
    bondDuration: 0,
    maxNominations: 0,
    sessionsPerEra: 0,
    maxNominatorRewardedPerValidator: 0,
    maxElectingVoters: 0,
  });

  // connection status state
  const [connectionStatus, setConnectionStatus]: any = useState(CONNECTION_STATUS[0]);

  // initial network connection
  useEffect(() => {
    const network: any = localStorage.getItem('network');
    connect(network);
  }, []);

  // define provider event handlers and connect callback on provider change
  useEffect(() => {
    if (provider !== null) {
      provider.on('connected', () => {
        setConnectionStatus(CONNECTION_STATUS[2]);
      });
      provider.on('error', () => {
        setConnectionStatus(CONNECTION_STATUS[0]);
      });
      connectedCallback(provider);
    }
  }, [provider]);

  // connection callback function fetches initial network metadata and makes api
  // available in context
  const connectedCallback = async (_provider: any) => {

    const { name } = network;

    const _api = new ApiPromise({ provider: _provider });
    await _api.isReady;

    const _metrics = await Promise.all([
      _api.consts.staking.bondingDuration,
      _api.consts.staking.maxNominations,
      _api.consts.staking.sessionsPerEra,
      _api.consts.staking.maxNominatorRewardedPerValidator,
      _api.consts.electionProviderMultiPhase.maxElectingVoters,
    ]);

    const bondDuration = _metrics[0] ? _metrics[0].toHuman() : BONDING_DURATION;
    const sessionsPerEra = _metrics[2] ? _metrics[2].toHuman() : SESSIONS_PER_ERA;
    const maxNominatorRewardedPerValidator = _metrics[3] ? _metrics[3].toHuman() : MAX_NOMINATOR_REWARDED_PER_VALIDATOR;
    const maxNominations = _metrics[1] ? _metrics[1].toHuman() : MAX_NOMINATIONS;
    let maxElectingVoters: any = _metrics[4];
    maxElectingVoters = maxElectingVoters?.toNumber();

    localStorage.setItem('network', String(name));

    setApi(_api);
    setConsts({
      bondDuration: bondDuration,
      maxNominations: maxNominations,
      sessionsPerEra: sessionsPerEra,
      maxNominatorRewardedPerValidator: Number(maxNominatorRewardedPerValidator),
      maxElectingVoters: Number(maxElectingVoters),
    });
  }

  // connect function sets provider and updates active network.
  const connect = async (_network: keyof NetworkOptions) => {
    const _provider = new WsProvider(NODE_ENDPOINTS[_network].endpoint);

    setNetwork({
      name: _network,
      meta: NODE_ENDPOINTS[_network as keyof NetworkOptions],
    });
    setProvider(_provider);
  }

  // handle network switching
  const switchNetwork = async (_network: keyof NetworkOptions) => {
    await api.disconnect();
    setApi(null);
    setConnectionStatus(CONNECTION_STATUS[1]);
    connect(_network);
  }

  // handles fetching of DOT price and updates context state.
  const fetchDotPrice = async () => {
    const urls = [
      `${API_ENDPOINTS.priceChange}${NODE_ENDPOINTS[network.name as keyof NetworkOptions].api.priceTicker}`,
    ];
    let responses = await Promise.all(urls.map(u => fetch(u, { method: 'GET' })))
    let texts = await Promise.all(responses.map(res => res.json()));
    const _change = texts[0];

    if (_change.lastPrice !== undefined && _change.priceChangePercent !== undefined) {
      let price: string = (Math.ceil(_change.lastPrice * 100) / 100).toFixed(2);
      let change: string = (Math.round(_change.priceChangePercent * 100) / 100).toFixed(2);

      return {
        lastPrice: price,
        change: change,
      };
    }
  }

  return (
    <APIContext.Provider value={{
      connect: connect,
      fetchDotPrice: fetchDotPrice,
      switchNetwork: switchNetwork,
      api: api,
      consts: consts,
      isReady: (connectionStatus === CONNECTION_STATUS[2] && api !== null),
      network: network.meta,
      status: connectionStatus,
    }}>
      {props.children}
    </APIContext.Provider>
  );
}