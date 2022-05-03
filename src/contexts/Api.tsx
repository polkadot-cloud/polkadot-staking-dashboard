// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
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

export const APIContextWrapper = (props: any) => {

  // default state
  const defaultNetwork: any = {
    name: localStorage.getItem('network'),
    meta: NODE_ENDPOINTS[localStorage.getItem('network') as keyof NetworkOptions],
  };

  // default consts
  const defaultConsts = {
    bondDuration: 0,
    maxNominations: 0,
    sessionsPerEra: 0,
    maxNominatorRewardedPerValidator: 0,
    voterSnapshotPerBlock: 0,
  };

  // api instance state
  const [api, setApi]: any = useState(null);

  // network state
  const [network, setNetwork]: any = useState(defaultNetwork);

  // constants state
  const [consts, _setConsts] = useState(defaultConsts);
  const constsRef = useRef(consts);
  const setConsts = (val: any) => {
    constsRef.current = val;
    _setConsts(val);
  }

  // connection status state
  const [connectionStatus, setConnectionStatus]: any = useState(CONNECTION_STATUS[0]);

  // initial connection
  useEffect(() => {
    const network: any = localStorage.getItem('network');
    connect(network);
  }, []);

  // returns whether api is ready to be used
  const isReady = (connectionStatus === CONNECTION_STATUS[2] && api !== null);

  // connect to websocket and return api into context
  const connect = async (_network: keyof NetworkOptions) => {

    // set connection status to 'connecting'
    setConnectionStatus(CONNECTION_STATUS[1]);

    // connect to network
    const wsProvider = new WsProvider(NODE_ENDPOINTS[_network].endpoint);

    // new connection event
    wsProvider.on('connected', () => {
      setConnectionStatus(CONNECTION_STATUS[2]);
    });

    // wsProvider.on('ready', () => {});

    // attempt to reconnect on an error
    wsProvider.on('error', () => {
      connect(network);
    });

    // api disconnect handler
    wsProvider.on('disconnected', () => {
      setApi(null);
      setNetwork(defaultNetwork);
      setConsts(defaultConsts);
      setConnectionStatus(CONNECTION_STATUS[0]);
    });

    // wait for instance to connect, then assign instance to context state
    const apiInstance = await ApiPromise.create({ provider: wsProvider });

    // get network consts
    const _metrics = await Promise.all([
      apiInstance.consts.staking.bondingDuration,
      apiInstance.consts.staking.maxNominations,
      apiInstance.consts.staking.sessionsPerEra,
      apiInstance.consts.staking.maxNominatorRewardedPerValidator,
      apiInstance.consts.electionProviderMultiPhase.voterSnapshotPerBlock,
    ]);

    // fallback to default values
    const bondDuration = _metrics[0] ? _metrics[0].toHuman() : BONDING_DURATION;
    const sessionsPerEra = _metrics[2] ? _metrics[2].toHuman() : SESSIONS_PER_ERA;
    const maxNominatorRewardedPerValidator = _metrics[3] ? _metrics[3].toHuman() : MAX_NOMINATOR_REWARDED_PER_VALIDATOR;
    const maxNominations = _metrics[1] ? _metrics[1].toHuman() : MAX_NOMINATIONS;
    let voterSnapshotPerBlock: any = _metrics[4];

    // some networks do not have this setting, default to zero if so
    voterSnapshotPerBlock = voterSnapshotPerBlock?.toNumber() ?? 0;

    // update local storage
    localStorage.setItem('network', String(_network));

    // update state
    setNetwork({
      name: _network,
      meta: NODE_ENDPOINTS[_network as keyof NetworkOptions],
    });
    setApi(apiInstance);
    setConsts({
      bondDuration: bondDuration,
      maxNominations: maxNominations,
      sessionsPerEra: sessionsPerEra,
      maxNominatorRewardedPerValidator: Number(maxNominatorRewardedPerValidator),
      voterSnapshotPerBlock: Number(voterSnapshotPerBlock),
    });
    setConnectionStatus(CONNECTION_STATUS[2]);
  }

  const switchNetwork = async (_network: keyof NetworkOptions) => {
    // return if different network
    if (_network === network.name) {
      return;
    }
    // reconnect to new network
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
      consts: constsRef.current,
      isReady: isReady,
      network: network.meta,
      status: connectionStatus,
    }}>
      {props.children}
    </APIContext.Provider>
  );
}

export default APIContextWrapper;