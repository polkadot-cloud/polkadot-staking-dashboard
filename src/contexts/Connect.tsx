import React from 'react';
import {
  web3Enable,
  web3AccountsSubscribe,
} from '@polkadot/extension-dapp';

// context type
export interface ConnectContextState {
  status: number,
  connect: () => void,
  disconnect: () => void;
  accounts: any;
  setAccounts: () => void;
  activeAccount: any;
}

// context definition
export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  status: 0,
  connect: () => { },
  disconnect: () => { },
  accounts: [],
  setAccounts: () => { },
  activeAccount: {},
});

// useAssistant
export const useConnect = () => React.useContext(ConnectContext);

// wrapper component to provide components with context
export class ConnectContextWrapper extends React.Component {

  state = {
    status: 0,
    accounts: [],
    activeAccount: {},
    unsubscribe: () => { },
  };

  subscribeWeb3Accounts = async () => {

    let accounts: any = [];

    // fetch accounts and subscribe to account changes
    const unsubscribe = await web3AccountsSubscribe((injectedAccounts) => {
      injectedAccounts.map((account) => {

        const { address, meta } = account;
        const { name, source } = meta;

        // format accounts into standard app format
        accounts.push({
          address: address,
          name: name,
          source: source
        });

        this.setState({
          status: 1,
          accounts: accounts,
          activeAccount: accounts[0],
        });
      })
    }, { ss58Format: 0 });

    this.setState({
      ...this.state,
      unsubscribe: unsubscribe,
    })
  }

  componentWillUnmount () {
    this.state.unsubscribe();
  }

  connect = () => {
    this.setState({ ...this.state, status: 1 });
  }

  disconnect = () => {
    this.setState({ ...this.state, status: 0 });
  }

  setAccounts = () => {
    this.subscribeWeb3Accounts();
  }

  render () {
    return (
      <ConnectContext.Provider value={{
        status: this.state.status,
        accounts: this.state.accounts,
        activeAccount: this.state.activeAccount,
        connect: this.connect,
        disconnect: this.disconnect,
        setAccounts: this.setAccounts,
      }}>
        {this.props.children}
      </ConnectContext.Provider>
    );
  }
}