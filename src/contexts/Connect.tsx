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
import { ConnectContextInterface } from 'types/connect';
import { MaybeAccount } from 'types';
import { useModal } from './Modal';
import { useApi } from './Api';

export const ConnectContext =
  React.createContext<ConnectContextInterface | null>(null);

export const useConnect = () => React.useContext(ConnectContext);

export const ConnectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useApi() as APIContextInterface;
  const { openModalWith } = useModal();

  // store accounts list
  const [accounts, setAccounts] = useState([]);
  const accountsRef = useRef(accounts);

  // store the currently active account
  const [activeAccount, _setActiveAccount] = useState<string | null>(
    localStorageOrDefault(`${network.name.toLowerCase()}_active_account`, null)
  );
  const activeAccountRef = useRef<string | null>(activeAccount);

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] = useState(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

  // store available extensions in state
  const [extensions, setExtensions]: any = useState([]);

  // store wallet errors
  const [extensionErrors, _setExtensionErrors] = useState({});
  const extensionErrorsRef: any = useRef(extensionErrors);

  // store unsubscribe handler for connected wallet
  const [unsubscribe, setUnsubscribe]: any = useState(null);
  const unsubscribeRef: any = useRef(unsubscribe);

  // store the currently active wallet
  const [activeExtension, _setActiveExtension] = useState(
    localStorageOrDefault('active_wallet', null)
  );

  // initialise extensions
  useEffect(() => {
    setExtensions(getWallets());

    return () => {
      if (unsubscribe !== null) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // re-import addresses with network switch
  useEffect(() => {
    if (accountsRef.current.length) {
      (async () => {
        if (unsubscribeRef.current !== null) {
          await unsubscribeRef.current();
        }
        importNetworkAddresses(accountsRef.current);
      })();
    }
  }, [network]);

  // automatic connect from active wallet
  useEffect(() => {
    // only auto connect if active extension exists in localstorage
    if (extensions.length && activeExtension !== null) {
      // we set a short timeout for extensions to initiate. This is a workaround
      // for a `NotInstalledError` that was happening when immediately attempting
      // to connect to an extension.
      setTimeout(() => connectExtension(), 100);
    }
  }, [extensions]);

  const setActiveExtension = (wallet: any) => {
    if (wallet === null) {
      localStorage.removeItem('active_wallet');
    } else {
      localStorage.setItem('active_wallet', wallet);
    }
    _setActiveExtension(wallet);
  };

  const setActiveAccount = (address: string | null) => {
    if (address === null) {
      localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
    } else {
      localStorage.setItem(
        `${network.name.toLowerCase()}_active_account`,
        address
      );
    }
    setStateWithRef(address, _setActiveAccount, activeAccountRef);
  };

  const setExtensionErrors = (key: string, value: string) => {
    const _errors: any = {
      ...extensionErrorsRef.current,
      [key]: value,
    };
    setStateWithRef(_errors, _setExtensionErrors, extensionErrorsRef);
  };

  const initialise = () => {
    if (activeExtension === null || activeAccountRef.current === null) {
      openModalWith(
        'ConnectAccounts',
        {
          section: 0,
        },
        'small'
      );
    } else {
      connectExtension(activeExtension);
    }
  };

  const connectExtension = async (_wallet: any = null) => {
    try {
      if (extensions.length === 0) {
        setActiveExtension(null);
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
            setExtensionErrors(_wallet, 'No accounts');
          } else {
            // import addresses with correct format
            importNetworkAddresses(injected);
            // set active wallet and connected status
            setActiveExtension(_wallet);
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
      setExtensionErrors(_wallet, 'Wallet not found');
    }
  };

  const importNetworkAddresses = (_accounts: any) => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // get account address in the correct format
    _accounts.forEach(async (account: any) => {
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;
      return account;
    });

    // get active account from local storage if present
    let _activeAccount: any = localStorageOrDefault(
      `${network.name.toLowerCase()}_active_account`,
      null
    );

    // ensure the account is in the correct format
    if (_activeAccount !== null) {
      _activeAccount = keyring.addFromAddress(_activeAccount).address;

      // check active account is in the currently selected wallet
      const activeAccountInWallet =
        _accounts.find((item: any) => item.address === _activeAccount) ?? null;

      // auto connect to account
      connectToAccount(activeAccountInWallet);
    } else {
      setActiveAccount(null);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    }

    // set available accounts
    setStateWithRef(_accounts, setAccounts, accountsRef);
  };

  const connectToAccount = (account: any = null) => {
    setActiveAccount(account.address);
    setStateWithRef(account, setActiveAccountMeta, activeAccountMetaRef);
  };

  const accountExists = (addr: string) => {
    const account = accountsRef.current.filter(
      (acc: any) => acc.address === addr
    );
    return account.length;
  };

  const getAccount = (addr: MaybeAccount) => {
    const accs = accountsRef.current.filter((acc: any) => acc.address === addr);
    if (accs.length) {
      return accs[0];
    }
    return null;
  };

  const disconnectFromAccount = () => {
    localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
    setActiveAccount(null);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
  };

  const disconnectExtension = () => {
    disconnectFromAccount();
    localStorage.removeItem('active_wallet');
    setActiveExtension(null);
    setStateWithRef([], setAccounts, accountsRef);
    setStateWithRef(null, setUnsubscribe, unsubscribeRef);
  };

  return (
    <ConnectContext.Provider
      value={{
        initialise,
        connectExtension,
        disconnectExtension,
        accountExists,
        getAccount,
        connectToAccount,
        disconnectFromAccount,
        extensions,
        activeExtension,
        extensionErrors,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
