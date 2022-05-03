// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as consts from '../constants';

// interface for endpoint options
type NetworkOptions = 'polkadot' | 'westend';

// api context definition
export const APIContext: any = React.createContext({
  api: null,
  connect: () => { },
  switchNetwork: () => { },
  status: consts.CONNECTION_STATUS[0],
  isReady: () => { },
  consts: {},
  fetchDotPrice: () => { },
});

// import context as a hook
export const useApi = () => React.useContext(APIContext);

// wrapper component to provide app with api
export const APIContextWrapper = (props: any) => {

  /*
   * The default state to fall back to when disconnect happens
   */
  const defaultState = () => {
    return {
      api: null,
      status: consts.CONNECTION_STATUS[0],
      consts: {
        bondDuration: 0,
        maxNominations: 0,
        sessionsPerEra: 0,
      },
      activeNetwork: localStorage.getItem('network'),
      network: consts.NODE_ENDPOINTS[localStorage.getItem('network') as keyof NetworkOptions],
    };
  }

  // initiate component state
  const [state, _setState] = useState({ ...defaultState() });
  const stateRef = useRef(state);
  const setState = (val: any) => {
    stateRef.current = val;
    _setState(val);
  }

  // initial connection
  useEffect(() => {
    const network: any = localStorage.getItem('network');
    connect(network);
  }, []);

  // returns whether api is ready to be used
  const isReady = () => {
    return (state.status === consts.CONNECTION_STATUS[2] && state.api !== null);
  }

  // connect to websocket and return api into context
  const connect = async (network: keyof NetworkOptions) => {
    // set connection status to 'connecting'
    setState({
      ...state,
      status: consts.CONNECTION_STATUS[1]
    });

    // connect to network
    const wsProvider = new WsProvider(consts.NODE_ENDPOINTS[network].endpoint);

    // new connection event
    wsProvider.on('connected', () => {
      setState({
        ...state,
        status: consts.CONNECTION_STATUS[2]
      });
    });

    // api disconnect handler
    wsProvider.on('disconnected', () => {
      setState(defaultState());
    });

    // wsProvider.on('ready', () => {});
    // wsProvider.on('error', () => {});

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
    const bondDuration = _metrics[0] ? _metrics[0].toHuman() : consts.BONDING_DURATION;
    const sessionsPerEra = _metrics[2] ? _metrics[2].toHuman() : consts.SESSIONS_PER_ERA;
    const maxNominatorRewardedPerValidator = _metrics[3] ? _metrics[3].toHuman() : consts.MAX_NOMINATOR_REWARDED_PER_VALIDATOR;
    const maxNominations = _metrics[1] ? _metrics[1].toHuman() : consts.MAX_NOMINATIONS;
    let voterSnapshotPerBlock: any = _metrics[4];

    // some networks do not have this setting, default to zero if so
    voterSnapshotPerBlock = voterSnapshotPerBlock?.toNumber() ?? 0;

    // updatd state
    const _state: any = {
      ...state,
      api: apiInstance,
      status: consts.CONNECTION_STATUS[2],
      consts: {
        bondDuration: bondDuration,
        maxNominations: maxNominations,
        sessionsPerEra: sessionsPerEra,
        maxNominatorRewardedPerValidator: Number(maxNominatorRewardedPerValidator),
        voterSnapshotPerBlock: Number(voterSnapshotPerBlock),
      }
    };
    setState(_state);
  }

  const disconnect = async () => {
    // disconnect from api
    const { api }: any = state;
    await api.disconnect();
  }

  const switchNetwork = async (newNetwork: keyof NetworkOptions) => {
    const { api }: any = state;

    // return if different network
    if (newNetwork === state.activeNetwork) {
      return;
    }
    // disconnect from current network and stop tickers
    await api.disconnect();

    // update local storage network
    localStorage.setItem('network', String(newNetwork));

    const _state: any = {
      ...defaultState(),
      status: consts.CONNECTION_STATUS[0],
      activeNetwork: newNetwork,
      network: consts.NODE_ENDPOINTS[newNetwork as keyof NetworkOptions],
    }

    // update app state
    setState(_state);

    // reconnect to new network
    connect(newNetwork);
  }



  // handles fetching of DOT price and updates context state.
  const fetchDotPrice = async () => {
    const urls = [
      `${consts.API_ENDPOINTS.priceChange}${consts.NODE_ENDPOINTS[state.activeNetwork as keyof NetworkOptions].api.priceTicker}`,
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
      switchNetwork: switchNetwork,
      fetchDotPrice: fetchDotPrice,
      isReady: isReady(),
      api: state.api,
      status: state.status,
      consts: state.consts,
      network: state.network,
    }}>
      {props.children}
    </APIContext.Provider>
  );
}

export default APIContextWrapper;