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

  // store accounts list
  const [accounts, setAccounts] = useState<any>([]);
  const accountsRef = useRef(accounts);

  // store the currently active account
  const [activeAccount, _setActiveAccount] = useState<string | null>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] = useState(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

  // store available extensions in state
  const [extensions, setExtensions]: any = useState([]);

  // store unsubscribe handler for connected wallet
  const [unsubscribe, setUnsubscribe]: any = useState([]);
  const unsubscribeRef: any = useRef(unsubscribe);

  // store the currently active wallet
  const [activeExtension, _setActiveExtension] = useState(
    localStorageOrDefault('active_extension', null)
  );

  // initialise extensions
  useEffect(() => {
    if (!extensions.length) {
      setExtensions(getWallets());
    }
    return () => {
      const _unsubs = unsubscribeRef.current;
      for (const unsub of _unsubs) {
        unsub();
      }
    };
  });

  // fetch extension accounts
  useEffect(() => {
    if (extensions.length) {
      getExtensionsAccounts();
    }
  }, [extensions]);

  // re-sync extensions on network switch
  useEffect(() => {
    if (extensions.length) {
      (async () => {
        const _unsubs = unsubscribeRef.current;
        for (const unsub of _unsubs) {
          unsub();
        }
        getExtensionsAccounts();
      })();
    }
  }, [network]);

  const getExtensionsAccounts = async () => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // get and format active account if present
    let _activeAccount: any = localStorageOrDefault(
      `${network.name.toLowerCase()}_active_account`,
      null
    );
    if (_activeAccount !== null) {
      _activeAccount = keyring.addFromAddress(_activeAccount).address;
    }

    // reset accounts context state
    setStateWithRef([], setAccounts, accountsRef.current);

    // iterate extensions and add accounts to state
    extensions.forEach(async (_extension: any) => {
      const { extensionName } = _extension;
      try {
        const extension: Wallet | undefined = getWalletBySource(extensionName);

        if (extension === undefined) {
          throw new Error('extension not found');
        } else {
          // summons extension popup
          await extension.enable(DAPP_NAME);

          // subscribe to accounts
          const _unsubscribe = await extension.subscribeAccounts(
            (injected: any) => {
              // abort if no accounts
              if (injected.length) {
                // reformat address to ensure correct format
                injected.forEach(async (account: any) => {
                  const { address } = keyring.addFromAddress(account.address);
                  account.address = address;
                  return account;
                });

                // connect to active account if found in extension
                const activeAccountInWallet =
                  injected.find(
                    (item: any) => item.address === _activeAccount
                  ) ?? null;

                if (activeAccountInWallet) {
                  connectToAccount(activeAccountInWallet);
                }

                // auto connect to account
                if (activeAccountInWallet !== null) {
                  connectToAccount(activeAccountInWallet);
                }
                // save imported accounts to state
                const _accounts = [...accountsRef.current].concat(injected);
                setStateWithRef(_accounts, setAccounts, accountsRef);
              }
            }
          );
          // update context state
          setStateWithRef(
            [...unsubscribeRef.current].concat(_unsubscribe),
            setUnsubscribe,
            unsubscribeRef
          );
        }
      } catch (err) {
        // extension not found
      }
    });
  };

  const setActiveExtension = (wallet: any) => {
    if (wallet === null) {
      localStorage.removeItem('active_extension');
    } else {
      localStorage.setItem('active_extension', wallet);
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

  const connectToAccount = (account: any) => {
    setActiveAccount(account.address);
    setStateWithRef(account, setActiveAccountMeta, activeAccountMetaRef);
  };

  const disconnectFromAccount = () => {
    localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
    setActiveAccount(null);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
  };

  const getAccount = (addr: MaybeAccount) => {
    const accs = accountsRef.current.filter((acc: any) => acc.address === addr);
    if (accs.length) {
      return accs[0];
    }
    return null;
  };

  const getActiveAccount = () => {
    return activeAccountRef.current;
  };

  return (
    <ConnectContext.Provider
      value={{
        getAccount,
        connectToAccount,
        disconnectFromAccount,
        setActiveExtension,
        getActiveAccount,
        extensions,
        activeExtension,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
