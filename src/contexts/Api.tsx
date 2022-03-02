// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { NODE_ENDPOINTS, CONNECTION_STATUS, API_ENDPOINTS } from '../constants';

// interface for endpoint options
type NetworkOptions = 'polkadot' | 'westend';

// api context definition
export const APIContext: any = React.createContext({
  api: null,
  connect: () => { },
  disconnect: () => { },
  switchNetwork: () => { },
  status: CONNECTION_STATUS[0],
  isReady: () => { },
  consts: {},
  prices: {},
});

// import context as a hook
export const useApi = () => React.useContext(APIContext);

// wrapper component to provide app with api
export class APIContextWrapper extends React.Component {

  state = {
    api: null,
    status: CONNECTION_STATUS[1],
    consts: {
      bondDuration: 0,
      maxNominations: 0,
      sessionsPerEra: 0,
    },
    prices: {
      lastPrice: 0,
      change: 0,
    },
    activeNetwork: localStorage.getItem('network'),
    network: NODE_ENDPOINTS[localStorage.getItem('network') as keyof NetworkOptions],
  };

  defaultState = () => {
    return {
      api: null,
      consts: {
        bondDuration: 0,
        maxNominations: 0,
        sessionsPerEra: 0,
      },
      prices: {
        lastPrice: 0,
        change: 0,
      }
    };
  }

  componentWillUnmount () {
    if (this.priceHandle) {
      clearInterval(this.priceHandle);
      this.priceHandle = 0;
    }
  }

  fetchPrices = async () => {
    const urls = [
      `${API_ENDPOINTS.priceChange}${NODE_ENDPOINTS[this.state.activeNetwork as keyof NetworkOptions].api.priceTicker}`,
    ];

    Promise.all(urls.map(u => fetch(u, { method: 'GET' }))).then(responses =>
      Promise.all(responses.map(res => res.json()))
    ).then(texts => {
      // const _price = texts[0];
      const _change = texts[0];

      if (_change.lastPrice !== undefined && _change.priceChangePercent !== undefined) {
        let price: string = (Math.ceil(_change.lastPrice * 100) / 100).toFixed(2);
        let change: string = (Math.round(_change.priceChangePercent * 100) / 100).toFixed(2);

        this.setState({
          ...this.state,
          prices: {
            lastPrice: price,
            change: change,
          }
        });
      }
    });
  }

  // subscribe to price data
  priceHandle: any;
  initiatePrices = async () => {
    this.fetchPrices();
    this.priceHandle = setInterval(() => {
      this.fetchPrices();
    }, 1000 * 60);
  }

  // returns whether api is ready to be used
  isReady = () => {
    return (this.state.status === CONNECTION_STATUS[2] && this.state.api !== null);
  }

  // connect to websocket and return api into context
  connect = async (network: keyof NetworkOptions) => {

    // set conection status to 'connecting'
    this.setState({ status: CONNECTION_STATUS[1] });

    // connect to network
    const wsProvider = new WsProvider(NODE_ENDPOINTS[network].endpoint);

    // connected to api event
    // other provider event listeners
    wsProvider.on('disconnected', () => {
      this.setState({
        ...this.state,
        status: CONNECTION_STATUS[0]
      });
    });
    wsProvider.on('connected', () => {
      this.setState({
        ...this.state,
        status: CONNECTION_STATUS[2]
      });
    });
    // wsProvider.on('ready', () => {
    // });
    // wsProvider.on('error', () => {
    // });

    // connect to price ticker handler
    this.initiatePrices();

    // wait for instance to connect, then assign instance to context state
    const apiInstance = await ApiPromise.create({ provider: wsProvider });

    // get network consts
    const _metrics = await Promise.all([
      apiInstance.consts.staking.bondingDuration,
      apiInstance.consts.staking.maxNominations,
      apiInstance.consts.staking.sessionsPerEra,
      apiInstance.consts.staking.maxNominatorRewardedPerValidator,
    ]);

    this.setState({
      ...this.state,
      api: apiInstance,
      status: CONNECTION_STATUS[2],
      consts: {
        bondDuration: _metrics[0].toHuman(),
        maxNominations: _metrics[1].toHuman(),
        sessionsPerEra: _metrics[2].toHuman(),
        maxNominatorRewardedPerValidator: _metrics[3].toHuman(),
      }
    });
  }

  disconnect = async () => {
    // stop price ticker
    clearInterval(this.priceHandle);
    // disconnect from api
    const { api }: any = this.state;
    await api.disconnect();
  }


  switchNetwork = async (newNetwork: keyof NetworkOptions) => {
    if (newNetwork === this.state.activeNetwork) {
      return;
    }
    // disconnect from current network and stop tickers
    await this.disconnect();

    // update local storage network
    window.localStorage.setItem('network', String(newNetwork));

    // update app state
    this.setState({
      ...this.defaultState(),
      status: CONNECTION_STATUS[0],
      activeNetwork: newNetwork,
      network: NODE_ENDPOINTS[newNetwork as keyof NetworkOptions],
    });

    // reconnect
    this.connect(newNetwork);
  }

  render () {
    return (
      <APIContext.Provider value={{
        connect: this.connect,
        disconnect: this.disconnect,
        switchNetwork: this.switchNetwork,
        isReady: this.isReady,
        api: this.state.api,
        status: this.state.status,
        consts: this.state.consts,
        prices: this.state.prices,
        network: this.state.network,
      }}>
        {this.props.children}
      </APIContext.Provider>
    );
  }
}

export default APIContextWrapper;