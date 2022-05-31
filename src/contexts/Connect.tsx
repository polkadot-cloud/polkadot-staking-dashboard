// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import Keyring from '@polkadot/keyring';
import {
  getWalletBySource,
  getWallets,
  Wallet,
} from '@talisman-connect/wallets';
import { localStorageOrDefault, setStateWithRef } from 'Utils';
import { DAPP_NAME } from 'consts';
import { APIContextInterface } from 'types/api';
import { useModal } from './Modal';
import { useApi } from './Api';

export interface ConnectContextState {
  disconnectFromAccount: () => void;
  disconnectFromWallet: () => void;
  initialise: () => void;
  accountExists: (a: string) => number;
  connectToWallet: (w: string) => void;
  getAccount: (a: string) => any;
  connectToAccount: (a: any) => void;
  activeExtension: any;
  accounts: any;
  activeAccount: string;
  activeAccountMeta: any;
  extensionErrors: any;
  extensions: any;
}

export const ConnectContext: React.Context<ConnectContextState> =
  React.createContext({
    disconnectFromAccount: () => {},
    disconnectFromWallet: () => {},
    initialise: () => {},
    accountExists: (a: string) => 0,
    connectToWallet: (w: string) => {},
    getAccount: (a: string) => {},
    connectToAccount: (a: any) => {},
    activeExtension: null,
    accounts: [],
    activeAccount: '',
    activeAccountMeta: {},
    extensionErrors: {},
    extensions: [],
  });

export const useConnect = () => React.useContext(ConnectContext);

export const ConnectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useApi() as APIContextInterface;
  const { openModalWith } = useModal();

  const setLocalStorageActiveAccount = (addr: string) => {
    localStorage.setItem(`${network.name.toLowerCase()}_active_account`, addr);
  };

  const getLocalStorageActiveAccount = () => {
    const account = localStorage.getItem(
      `${network.name.toLowerCase()}_active_account`
    );
    return account === null ? '' : account;
  };

  const removeLocalStorageActiveAccount = () => {
    localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
  };

  // store the currently active wallet
  const [activeExtension, _setactiveExtension] = useState(
    localStorageOrDefault('active_wallet', null)
  );

  const setactiveExtension = (wallet: any) => {
    if (wallet === null) {
      localStorage.removeItem('active_wallet');
    } else {
      localStorage.setItem('active_wallet', wallet);
    }
    _setactiveExtension(wallet);
  };

  // store the currently active account
  const [activeAccount, _setActiveAccount] = useState(
    getLocalStorageActiveAccount()
  );
  const activeAccountRef = useRef(activeAccount);

  const setActiveAccount = (address: string) => {
    setLocalStorageActiveAccount(address);
    setStateWithRef(address, _setActiveAccount, activeAccountRef);
  };

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] = useState(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

  // store accounts list
  const [accounts, setAccounts] = useState([]);
  const accountsRef = useRef(accounts);

  // store wallet errors
  const [extensionErrors, _setextensionErrors] = useState({});
  const extensionErrorsRef: any = useRef(extensionErrors);

  const setextensionErrors = (key: string, value: string) => {
    const _errors: any = { ...extensionErrorsRef.current };
    _errors[key] = value;
    setStateWithRef(_errors, _setextensionErrors, extensionErrorsRef);
  };

  // store unsubscribe handler for connected wallet
  const [unsubscribe, setUnsubscribe]: any = useState(null);
  const unsubscribeRef: any = useRef(unsubscribe);

  const [extensions, setExtensions]: any = useState([]);

  // initialise extensions
  useEffect(() => {
    initExtensions();
    return () => {
      if (unsubscribe !== null) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // give web page time to initiate extensions
  const initExtensions = async () => {
    const _extensions = getWallets();
    setExtensions(_extensions);
  };

  // automatic connect from active wallet
  useEffect(() => {
    // only auto connect if active wallet exists in localstorage
    if (extensions.length && activeExtension !== null) {
      connectToWallet();
    }
  }, [extensions]);

  // re-import addresses with network switch
  useEffect(() => {
    if (accountsRef.current.length) {
      handleReconnect();
    }
  }, [network]);

  const handleReconnect = async () => {
    if (unsubscribeRef.current !== null) {
      await unsubscribeRef.current();
    }
    importNetworkAddresses(accounts, activeExtension);
  };

  const connectToWallet = async (_wallet: any = null) => {
    try {
      if (extensions.length === 0) {
        setactiveExtension(null);
        return;
      }

      if (_wallet === null) {
        if (activeExtension !== null) {
          _wallet = activeExtension;
        }
      }

      // get wallet
      const wallet: Wallet | undefined = getWalletBySource(_wallet);

      if (wallet === undefined) {
        throw new Error('wallet not found');
      } else {
        // summons extension popup
        await wallet.enable(DAPP_NAME);

        // subscribe to accounts
        const _unsubscribe = await wallet.subscribeAccounts((injected: any) => {
          // abort if no accounts
          if (!injected.length) {
            setextensionErrors(_wallet, 'No accounts');
          } else {
            // import addresses with correct format
            importNetworkAddresses(injected, _wallet);
            // set active wallet and connected status
            setactiveExtension(_wallet);
          }
        });

        // unsubscribe if errors exist
        const _hasError = extensionErrorsRef.current?._wallet ?? null;
        if (_hasError !== null) {
          disconnectFromAccount();
        }

        // update context state
        setStateWithRef(_unsubscribe, setUnsubscribe, unsubscribeRef);
      }
    } catch (err) {
      // wallet not found.
      setextensionErrors(_wallet, 'Wallet not found');
    }
  };

  const importNetworkAddresses = (_accounts: any, wallet: any) => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    _accounts.forEach(async (account: any) => {
      // get account address in the correct format
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;
      return account;
    });

    // active account is first in list if none presently persisted
    let _activeAccount: any = getLocalStorageActiveAccount();

    if (_activeAccount !== '') {
      _activeAccount = keyring.addFromAddress(_activeAccount).address;
    }

    // check active account is in the currently selected wallet
    const activeAccountInWallet = _accounts.find(
      (item: any) => item.address === _activeAccount
    );

    // auto connect to account
    connectToAccount(activeAccountInWallet);

    // set available accounts
    setStateWithRef(_accounts, setAccounts, accountsRef);
  };

  const connectToAccount = (account: any = null) => {
    if (account !== null) {
      setActiveAccount(account.address);
      setStateWithRef(account, setActiveAccountMeta, activeAccountMetaRef);
    }
  };

  const disconnectFromWallet = () => {
    disconnectFromAccount();
    localStorage.removeItem('active_wallet');
    setactiveExtension(null);
    setStateWithRef([], setAccounts, accountsRef);
    setStateWithRef(null, setUnsubscribe, unsubscribeRef);
  };

  const disconnectFromAccount = () => {
    removeLocalStorageActiveAccount();
    setActiveAccount('');
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
  };

  const initialise = () => {
    if (activeExtension === null || activeAccountRef.current === '') {
      openModalWith(
        'ConnectAccounts',
        {
          section: 0,
        },
        'small'
      );
    } else {
      connectToWallet(activeExtension);
    }
  };

  const accountExists = (addr: string) => {
    const account = accountsRef.current.filter(
      (acc: any) => acc.address === addr
    );
    return account.length;
  };

  const getAccount = (addr: string) => {
    const accs = accountsRef.current.filter((acc: any) => acc.address === addr);
    if (accs.length) {
      return accs[0];
    }
    return null;
  };

  return (
    <ConnectContext.Provider
      value={{
        accountExists,
        connectToWallet,
        disconnectFromAccount,
        disconnectFromWallet,
        initialise,
        getAccount,
        connectToAccount,
        activeExtension,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
        extensionErrors,
        extensions,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
