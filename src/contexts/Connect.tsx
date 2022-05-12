// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { useApi } from './Api';
import { localStorageOrDefault } from '../Utils';
import { useModal } from './Modal';
import Keyring from '@polkadot/keyring';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { DAPP_NAME } from '../constants';

export interface ConnectContextState {
  disconnectFromAccount: () => void;
  disconnectFromWallet: () => void;
  initialise: () => void;
  accountExists: (a: string) => number;
  connectToWallet: (w: string) => void;
  getAccount: (a: string) => any;
  connectToAccount: (a: any) => void;
  activeWallet: any;
  accounts: any;
  activeAccount: string;
  activeAccountMeta: any;
  walletErrors: any;
}

export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  disconnectFromAccount: () => { },
  disconnectFromWallet: () => { },
  initialise: () => { },
  accountExists: (a: string) => 0,
  connectToWallet: (w: string) => { },
  getAccount: (a: string) => { },
  connectToAccount: (a: any) => { },
  activeWallet: null,
  accounts: [],
  activeAccount: '',
  activeAccountMeta: {},
  walletErrors: {},
});

export const useConnect = () => React.useContext(ConnectContext);

export const ConnectProvider = (props: any) => {

  const { network }: any = useApi();
  const { openModalWith } = useModal();

  const setLocalStorageActiveAccount = (addr: string) => {
    localStorage.setItem(`${network.name.toLowerCase()}_active_account`, addr);
  }

  const getLocalStorageActiveAccount = () => {
    const account = localStorage.getItem(`${network.name.toLowerCase()}_active_account`);
    return account === null ? '' : account;
  }

  const removeLocalStorageActiveAccount = () => {
    localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
  }

  // store the currently active wallet
  const [activeWallet, _setActiveWallet] = useState(
    localStorageOrDefault('active_wallet', null)
  );

  const setActiveWallet = (wallet: any) => {
    if (wallet === null) {
      localStorage.removeItem('active_wallet');
    } else {
      localStorage.setItem('active_wallet', wallet);
    }
    _setActiveWallet(wallet);
  }

  // store the currently active account
  const [activeAccount, __setActiveAccount] = useState('');
  const activeAccountRef = useRef(activeAccount);
  const _setActiveAccount = (v: any) => {
    activeAccountRef.current = v;
    __setActiveAccount(v);
  }

  // store the currently active account metadata
  const [activeAccountMeta, _setActiveAccountMeta] = useState('');
  const activeAccountMetaRef = useRef(activeAccountMeta);
  const setActiveAccountMeta = (v: any) => {
    activeAccountMetaRef.current = v;
    _setActiveAccountMeta(v);
  }

  // store accounts list
  const [accounts, _setAccounts] = useState([]);
  const accountsRef = useRef(accounts);
  const setAccounts = (v: any) => {
    accountsRef.current = v;
    _setAccounts(v);
  }

  // store wallet errors
  const [walletErrors, _setWalletErrors] = useState({});
  const walletErrorsRef: any = useRef(walletErrors);

  const setWalletErrors = (key: string, value: string) => {
    let _errors: any = { ...walletErrorsRef.current };
    _errors[key] = value;

    walletErrorsRef.current = _errors;
    _setWalletErrors(_errors);
  }

  // store unsubscribe handler for connected wallet
  const [unsubscribe, _setUnsubscribe]: any = useState(null);
  const unsubscribeRef: any = useRef(unsubscribe);
  const setUnsubscribe = (v: any) => {
    unsubscribeRef.current = v;
    _setUnsubscribe(v);
  }

  // automatic connect from active wallet
  useEffect(() => {
    connectToWallet();
    return (() => {
      if (unsubscribe !== null) {
        unsubscribeRef.current();
      }
    })
  }, []);

  // re-import addresses with network switch
  useEffect(() => {
    // unsubscribe to current account
    handleReconnect();
  }, [network]);

  const handleReconnect = async () => {
    if (unsubscribeRef.current !== null) {
      await unsubscribeRef.current();
    }
    importNetworkAddresses(accounts, activeWallet);
  }

  const connectToWallet = async (_wallet: any = null) => {
    try {
      // get extensions
      const extensions = await web3Enable(DAPP_NAME);

      // return if no extensions enabled or found
      if (extensions.length === 0) {
        setActiveWallet(null);
        return;
      }

      // determine wallet or abort if none selected
      if (_wallet === null) {
        if (activeWallet !== null) {
          _wallet = activeWallet;
        } else {
          _wallet = _wallet
        }
      }

      // subscribe to accounts
      const _unsubscribe = await web3AccountsSubscribe((injected) => {

        // abort if no accounts
        if (!injected.length) {
          setWalletErrors(_wallet, 'No accounts');
        } else {
          // import addresses with correct format
          importNetworkAddresses(injected, _wallet);
          // set active wallet and connected status
          setActiveWallet(_wallet);
        }
      });

      // unsubscribe if errors exist
      let _hasError = walletErrorsRef.current?._wallet ?? null;
      if (_hasError !== null) {
        disconnectFromAccount();
      }

      // update context state
      setUnsubscribe(_unsubscribe);

    } catch (err) {
      // wallet not found.
      setWalletErrors(_wallet, 'Wallet not found');
    }
  }

  const importNetworkAddresses = (accounts: any, wallet: any) => {
    let _accounts: any = [];

    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    accounts.map(async (account: any, i: number) => {
      // get account address in the correct format
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;

      // check source is active wallet
      let { meta } = account;
      const { source } = meta;

      if (source === wallet) {
        _accounts.push(account);
      }
      return false;
    });

    // active account is first in list if none presently persisted
    let _activeAccount: any = getLocalStorageActiveAccount();
    if (_activeAccount !== '') {
      _activeAccount = keyring.addFromAddress(_activeAccount).address;
    }

    // check active account is in the currently selected wallet
    let activeAccountInWallet = _accounts.find((item: any) => item.address === _activeAccount);

    // auto connect to account
    connectToAccount(activeAccountInWallet);

    // set available accounts
    setAccounts(_accounts);
  }

  const connectToAccount = (account: any = null) => {
    setActiveAccount(account == null ? '' : account.address);
    setActiveAccountMeta(account);
  }

  const disconnectFromWallet = () => {
    disconnectFromAccount();
    localStorage.removeItem('active_wallet');
    setActiveWallet(null);
    setAccounts([]);
    setUnsubscribe(null);
  }

  const disconnectFromAccount = () => {
    removeLocalStorageActiveAccount();
    setActiveAccount('');
    setActiveAccountMeta(null);
  }

  const initialise = () => {
    if (activeWallet === null || activeAccount === '') {
      openModalWith('ConnectAccounts', {
        section: 0,
      }, 'small');
    } else {
      connectToWallet(activeWallet);
    }
  }

  const setActiveAccount = (address: string) => {
    setLocalStorageActiveAccount(address);
    _setActiveAccount(address);
  }

  const accountExists = (addr: string) => {
    const account = accountsRef.current.filter((acc: any) => acc.address === addr);
    return account.length;
  }

  const getAccount = (addr: string) => {
    const accs = accountsRef.current.filter((acc: any) => acc.address === addr);
    if (accs.length) {
      return accs[0];
    } else {
      return null;
    }
  }

  return (
    <ConnectContext.Provider value={{
      activeWallet: activeWallet,
      accounts: accountsRef.current,
      activeAccount: activeAccountRef.current,
      activeAccountMeta: activeAccountMetaRef.current,
      walletErrors: walletErrors,
      accountExists: accountExists,
      connectToWallet: connectToWallet,
      disconnectFromAccount: disconnectFromAccount,
      disconnectFromWallet: disconnectFromWallet,
      initialise: initialise,
      getAccount: getAccount,
      connectToAccount: connectToAccount,
    }}>
      {props.children}
    </ConnectContext.Provider>
  );
}