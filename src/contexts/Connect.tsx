// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  web3Enable,
  web3AccountsSubscribe,
} from '@polkadot/extension-dapp';
import { APIContext } from './Api';

// context type
export interface ConnectContextState {
  connect: () => void,
  disconnect: () => void;
  setAccounts: () => void;
  setActiveAccount: (a: string) => void;
  accountExists: (a: string) => number;
  getAccount: (a: string) => any;
  status: number,
  accounts: any;
  activeAccount: string;
}

// context definition
export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  status: 0,
  connect: () => { },
  disconnect: () => { },
  setAccounts: () => { },
  setActiveAccount: (a: string) => { },
  accountExists: (a: string) => 0,
  getAccount: (a: string) => { },
  accounts: [],
  activeAccount: '',
});
export const useConnect = () => React.useContext(ConnectContext);

// wrapper component to provide components with context
export class ConnectContextWrapper extends React.Component {

  static contextType = APIContext;

  state = {
    status: 0,
    accounts: [],
    activeAccount: '',
    unsubscribe: () => { },
    messages: [],
  };

  // automatically connect to accounts
  componentDidMount () {
    this.subscribeWeb3Accounts();
  }

  subscribeWeb3Accounts = async () => {
    // attempt to connect to Polkadot JS extension
    const extensions = await web3Enable('polkadot_staking_dashboard');

    // no extension found
    if (extensions.length === 0) {
      return;
    }
    // fetch accounts and subscribe to account changes
    const unsubscribe = await web3AccountsSubscribe(async (injectedAccounts) => {
      let accounts: any = [];

      injectedAccounts.map(async (account, i) => {
        const { address, meta } = account;
        const { name, source } = meta;
        // format accounts into standard app format
        accounts.push({
          address: address,
          name: name,
          source: source
        });
        return false;
      });


      // manage localStorage active account
      let _activeAccount = this.getLocalStorageActiveAccount();
      if (_activeAccount === '') {
        this.setLocalStorageActiveAccount(accounts[0].address);
        _activeAccount = accounts[0].address;
      }

      this.setState({
        ...this.state,
        status: 1,
        accounts: accounts,
        activeAccount: _activeAccount,
      });
    }, { ss58Format: 0 });

    this.setState({ ...this.state, unsubscribe: unsubscribe, });
  }

  componentWillUnmount () {
    this.state.unsubscribe();
  }

  connect = () => {
    this.setState({ ...this.state, status: 1 });
  }

  disconnect = () => {
    this.removeLocalStorageActiveAccount();
    this.setState({
      status: 0,
      accounts: [],
      unsubscribe: () => { },
      messages: [],
    });
  }

  setAccounts = () => {
    // subscribe to accounts via polkadot.js extension
    this.subscribeWeb3Accounts();
  }

  setActiveAccount = (address: string) => {
    this.setLocalStorageActiveAccount(address);
    this.setState({
      ...this.state,
      activeAccount: address,
    });
  }

  accountExists = (addr: string) => {
    const account = this.state.accounts.filter((acc: any) => acc.address === addr);
    return account.length;
  }

  getAccount = (addr: string) => {
    const accs = this.state.accounts.filter((acc: any) => acc.address === addr);
    if (accs.length) {
      return accs[0];
    } else {
      return null;
    }
  }

  // manage localStorage for active account

  setLocalStorageActiveAccount = (addr: string) => {
    localStorage.setItem(`${this.context.network.name.toLowerCase()}_active_acount`, addr);
  }

  getLocalStorageActiveAccount = () => {
    const account = localStorage.getItem(`${this.context.network.name.toLowerCase()}_active_acount`) === null
      ? ''
      : localStorage.getItem(`${this.context.network.name.toLowerCase()}_active_acount`);
    return account;
  }

  removeLocalStorageActiveAccount = () => {
    localStorage.removeItem(`${this.context.network.name.toLowerCase()}_active_acount`);
  }

  render () {
    return (
      <ConnectContext.Provider value={{
        status: this.state.status,
        accounts: this.state.accounts,
        activeAccount: this.state.activeAccount,
        accountExists: this.accountExists,
        connect: this.connect,
        disconnect: this.disconnect,
        setAccounts: this.setAccounts,
        setActiveAccount: this.setActiveAccount,
        getAccount: this.getAccount,
      }}>
        {this.props.children}
      </ConnectContext.Provider>
    );
  }
}