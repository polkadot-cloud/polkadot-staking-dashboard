import React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { API_ENDPOINT, CONNECTION_STATUS } from '../constants';

// api context definition
export const APIContext: any = React.createContext({
  api: null,
  connect: () => { },
  status: CONNECTION_STATUS[0],
  isReady: () => { },
  consts: {},
});

// import context as a hook
export const useApi = () => React.useContext(APIContext);

// wrapper component to provide app with api
export class APIContextWrapper extends React.Component {

  state = {
    api: null,
    status: CONNECTION_STATUS[1],
    consts: {
      activeEra: 0,
      maxNominations: 0,
      sessionsPerEra: 0,
    }
  };

  // returns whether api is ready to be used
  isReady = () => {
    return (this.state.status === CONNECTION_STATUS[2] && this.state.api !== null);
  }

  // connect to websocket and return api into context
  connect = async () => {

    // set conection status to 'connecting'
    this.setState({ status: CONNECTION_STATUS[1] });

    // attempting to connect to api
    const wsProvider = new WsProvider(API_ENDPOINT);

    // connected to api event
    // other provider event listeners
    wsProvider.on('disconnected', () => {
      this.setState({ status: CONNECTION_STATUS[0] });
    });
    wsProvider.on('connected', () => {
      this.setState({ status: CONNECTION_STATUS[2] });
    });
    // wsProvider.on('ready', () => {
    // });
    // wsProvider.on('error', () => {
    // });

    // wait for instance to connect, then assign instance to context state
    const apiInstance = await ApiPromise.create({ provider: wsProvider });

    // get network consts
    const _metrics = await Promise.all([
      apiInstance.consts.staking.bondingDuration,
      apiInstance.consts.staking.maxNominations,
      apiInstance.consts.staking.sessionsPerEra,
    ]);

    this.setState({
      api: apiInstance,
      status: CONNECTION_STATUS[2],
      consts: {
        activeEra: _metrics[0].toHuman(),
        maxNominations: _metrics[1].toHuman(),
        sessionsPerEra: _metrics[2].toHuman(),
      }
    });
  }

  render () {
    return (
      <APIContext.Provider value={{
        connect: this.connect,
        api: this.state.api,
        status: this.state.status,
        consts: this.state.consts,
        isReady: this.isReady,
      }}>
        {this.props.children}
      </APIContext.Provider>
    );
  }
}

export default APIContextWrapper;