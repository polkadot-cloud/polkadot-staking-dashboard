// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  web3Enable,
  web3AccountsSubscribe,
} from '@polkadot/extension-dapp';
import { Metadata } from '@polkadot/types';

// context type
export interface ConnectContextState {
  connect: () => void,
  disconnect: () => void;
  setAccounts: () => void;
  setActiveAccount: (a: string) => void;
  accountExists: (a: string) => number;
  getMessage: (k: string) => any;
  setMessage: (k: string, v: any) => any;
  removeMessage: (k: string) => void;
  status: number,
  accounts: any;
  activeAccount: string;
  messages: Array<any>;
}

// context definition
export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  status: 0,
  connect: () => { },
  disconnect: () => { },
  setAccounts: () => { },
  setActiveAccount: (a: string) => { },
  accountExists: (a: string) => 0,
  getMessage: (k: string) => { },
  setMessage: (k: string, v: any) => { },
  removeMessage: (k: string) => { },
  accounts: [],
  activeAccount: '',
  messages: [{}],
});
export const useConnect = () => React.useContext(ConnectContext);

// wrapper component to provide components with context
export class ConnectContextWrapper extends React.Component {

  state = {
    status: 0,
    accounts: [],
    activeAccount: '',
    unsubscribe: () => { },
    messages: [],
  };

  // automatically connect to web3 (will work if already authorized)
  // 'auto connect' should be a toggle stored in localStorage for user-set auto connect.
  componentDidMount () {
    this.subscribeWeb3Accounts();
  }

  subscribeWeb3Accounts = async () => {
    // attempt to connect to Polkadot JS extension
    const extensions = await web3Enable('rb_polkadot_staking');

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
      activeAccount: '',
      unsubscribe: () => { },
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
      messages: [],
    });
  }

  accountExists = (addr: string) => {
    const account = this.state.accounts.filter((acc: any) => acc.address === addr);
    return account.length;
  }

  // manage localStorage for active account

  setLocalStorageActiveAccount = (addr: string) => {
    localStorage.setItem('active_acount', addr);
  }

  getLocalStorageActiveAccount = () => {
    const account = localStorage.getItem('active_acount') === null
      ? ''
      : localStorage.getItem('active_acount');

    return account;
  }

  removeLocalStorageActiveAccount = () => {
    localStorage.removeItem('active_account');
  }

  // manage app messages

  getMessage = (key: string) => {
    const _message = this.state.messages.filter((msg: any) => msg.key === key);
    if (_message.length) {
      return _message[0];
    } else {
      return null;
    }
  }

  setMessage = (key: string, msg: any) => {
    // remove if key exists
    let _messages: any = this.state.messages.filter((msg: any) => msg.key !== key);
    // add message
    _messages.push({
      key: key,
      msg: msg,
    });

    this.setState({
      ...this.state,
      messages: _messages,
    });
  }

  removeMessage = (key: string) => {
    const _messages = this.state.messages.filter((msg: any) => msg.key !== key);
    this.setState({
      ...this.state,
      messages: _messages,
    });
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
        getMessage: this.getMessage,
        setMessage: this.setMessage,
        removeMessage: this.removeMessage,
        messages: this.state.messages,
      }}>
        {this.props.children}
      </ConnectContext.Provider>
    );
  }
}