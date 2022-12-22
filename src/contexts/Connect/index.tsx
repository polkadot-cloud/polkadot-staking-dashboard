// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import {
  ConnectContextInterface,
  ExternalAccount,
  ImportedAccount,
} from 'contexts/Connect/types';
import { useExtensions } from 'contexts/Extensions';
import {
  ExtensionAccount,
  ExtensionInjected,
  ExtensionInteface,
} from 'contexts/Extensions/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { defaultConnectContext } from './defaults';
import { useImportExtension } from './Hooks/useImportExtension';
import {
  extensionIsLocal,
  getActiveAccountLocal,
  getLocalExternalAccounts,
  removeFromLocalExtensions,
  removeLocalExternalAccounts,
} from './Utils';

export const ConnectContext = React.createContext<ConnectContextInterface>(
  defaultConnectContext
);

export const useConnect = () => React.useContext(ConnectContext);

export const ConnectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useApi();
  const {
    setExtensionStatus,
    extensionsFetched,
    setExtensionsFetched,
    extensions,
  } = useExtensions();
  const {
    handleImportExtension,
    getActiveExtensionAccount,
    connectActiveExtensionAccount,
  } = useImportExtension();

  // store accounts list
  const [accounts, setAccounts] = useState<Array<ImportedAccount>>([]);
  const accountsRef = useRef(accounts);

  // store the currently active account
  const [activeAccount, _setActiveAccount] = useState<string | null>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] =
    useState<ImportedAccount | null>(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

  // store unsubscribe handler for connected extensions
  const [unsubscribe, setUnsubscribe] = useState<AnyApi>([]);
  const unsubscribeRef = useRef(unsubscribe);

  /* re-sync extensions accounts on network switch
   * do this if activeAccount is present.
   * if activeAccount is present, and extensions have for some
   * reason forgot the site, then all pop-ups will be summoned
   * here.
   */
  useEffect(() => {
    // unsubscribe from all accounts and reset state
    unsubscribeAll();
    setStateWithRef(null, _setActiveAccount, activeAccountRef);
    setStateWithRef([], setAccounts, accountsRef);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    setExtensionsFetched(false);

    // get active extensions
    const localExtensions = localStorageOrDefault(
      `active_extensions`,
      [],
      true
    );
    // if extensions have been fetched,
    // get accounts if extensions exist and
    // local extensions exist (previously connected).
    if (extensions) {
      if (extensions.length && localExtensions.length) {
        connectActiveExtensions();
      } else {
        setExtensionsFetched(true);
      }
    }
    return () => {
      unsubscribeAll();
    };
  }, [extensions?.length, network]);

  // once extension accounts are synced, fetch
  // any external accounts present in localStorage.
  useEffect(() => {
    if (extensionsFetched) importExternalAccounts();
  }, [extensionsFetched]);

  /*
   * Unsubscrbe all account subscriptions
   */
  const unsubscribeAll = () => {
    unsubscribeRef.current.forEach(({ unsub }: AnyApi) => unsub());
  };

  /*
   * Unsubscrbe from some account subscriptions and update the resulting state.
   */
  const forgetAccounts = (forget: Array<ExternalAccount>) => {
    if (!forget.length) return;
    const addresses = forget.map((a: ExternalAccount) => a.address);

    // unsubscribe from provided addresses
    Object.values(
      unsubscribeRef.current.filter((f: AnyApi) => addresses.includes(f.key))
    ).forEach(({ unsub }: AnyApi) => unsub());

    // filter addresses from current unsubs
    const unsubsNew = unsubscribeRef.current.filter(
      (f: AnyApi) => !addresses.includes(f.key)
    );

    // if active account is being forgotten, disconnect
    const activeAccountUnsub = forget.find(
      (a: ExternalAccount) => a.address === activeAccount
    );
    if (activeAccountUnsub !== undefined) {
      setStateWithRef(null, setActiveAccount, activeAccountRef);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    }

    // remove forgotten external accounts from localStorage
    removeLocalExternalAccounts(network, forget);

    // update accounts
    const accountsNew = accountsRef.current.filter(
      (a: ImportedAccount) =>
        forget.find((e: ExternalAccount) => e.address === a.address) ===
        undefined
    );

    // update accounts and corresponding unsubs
    setStateWithRef(accountsNew, setAccounts, accountsRef);
    setStateWithRef(unsubsNew, setUnsubscribe, unsubscribeRef);
  };

  /* importExternalAccounts
   * checks previously imported read-only accounts from
   * localStorage and adds them to `accounts` state.
   * if local active account is present, it will also be
   * assigned as active.
   * Should be called AFTER extension accounts are imported, as
   * to not replace an extension account by an external account.
   */
  const importExternalAccounts = () => {
    // import any local external accounts
    let localExternalAccounts = getLocalExternalAccounts(network, true);

    if (localExternalAccounts.length) {
      // get and format active account if present
      const activeAccountLocal = getActiveAccountLocal(network);

      const activeAccountIsExternal =
        localExternalAccounts.find(
          (a: ImportedAccount) => a.address === activeAccountLocal
        ) ?? null;

      // remove already-imported accounts (extensions may have already imported)
      localExternalAccounts = localExternalAccounts.filter(
        (l: ExternalAccount) =>
          accountsRef.current.find(
            (a: ImportedAccount) => a.address === l.address
          ) === undefined
      );

      // set active account for network
      if (activeAccountIsExternal) {
        connectToAccount(activeAccountIsExternal);
      }
      // add external accounts to imported
      setStateWithRef(
        [...accountsRef.current].concat(localExternalAccounts),
        setAccounts,
        accountsRef
      );
    }
  };

  /* connectActiveExtensions
   * Connects to extensions that already have been connected
   * to and stored in localStorage.
   * Loop through extensions and connect to accounts.
   * If `activeAccount` exists locally, we wait until all
   * extensions are looped before connecting to it; there is
   * no guarantee it still exists - must explicitly find it.
   */
  const connectActiveExtensions = async () => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // iterate extensions and add accounts to state
    const total = extensions?.length ?? 0;
    let activeWalletAccount: ImportedAccount | null = null;

    if (!extensions) {
      return;
    }

    let i = 0;
    extensions.forEach(async (e: ExtensionInjected) => {
      i++;

      // ensure the extension carries an `id` property
      const id = e?.id ?? undefined;

      if (id) {
        // if extension is found locally, subscribe to accounts
        if (extensionIsLocal(id)) {
          try {
            // attempt to get extension `enable` property
            const { enable } = e;

            // summons extension popup
            const extension: ExtensionInteface = await enable(DappName);

            if (extension !== undefined) {
              const unsub = (await extension.accounts.subscribe(
                (injected: ExtensionAccount[]) => {
                  if (injected) {
                    injected = handleImportExtension(
                      id,
                      accountsRef.current,
                      extension,
                      injected,
                      forgetAccounts
                    );
                    // store active wallet account if found in this extension
                    if (!activeWalletAccount) {
                      activeWalletAccount = getActiveExtensionAccount(injected);
                    }
                    // set active account for network on final extension
                    if (i === total && activeAccountRef.current === null) {
                      connectActiveExtensionAccount(
                        activeWalletAccount,
                        connectToAccount
                      );
                    }
                    // concat accounts and store
                    if (injected.length) {
                      setStateWithRef(
                        [...accountsRef.current].concat(injected),
                        setAccounts,
                        accountsRef
                      );
                    }
                  }
                }
              )) as () => void;

              // update context state
              setStateWithRef(
                [...unsubscribeRef.current].concat({
                  key: id,
                  unsub,
                }),
                setUnsubscribe,
                unsubscribeRef
              );
            }
          } catch (err) {
            handleExtensionError(id, String(err));
          }
        }
      }

      // set extension fetched to allow external accounts
      // to be imported.
      if (i === total) {
        setExtensionsFetched(true);
      }
    });
  };

  /* connectExtensionAccounts
   * Similar to the above but only connects to a single extension.
   * This is invoked by the user by clicking on an extension.
   * If activeAccount is not found here, it is simply ignored.
   */
  const connectExtensionAccounts = async (e: ExtensionInjected) => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // ensure the extension carries an `id` property
    const id = e?.id ?? undefined;

    if (id) {
      try {
        // attempt to get extension `enable` property
        const { enable } = e;

        // summons extension popup
        const extension: ExtensionInteface = await enable(DappName);

        if (extension !== undefined) {
          // subscribe to accounts
          const unsub = (await extension.accounts.subscribe(
            (injected: ExtensionAccount[]) => {
              if (injected) {
                injected = handleImportExtension(
                  id,
                  accountsRef.current,
                  extension,
                  injected,
                  forgetAccounts
                );
                // set active account for network if not yet set
                if (activeAccountRef.current === null) {
                  connectActiveExtensionAccount(
                    getActiveExtensionAccount(injected),
                    connectToAccount
                  );
                }
                // concat accounts and store
                setStateWithRef(
                  [...accountsRef.current].concat(injected),
                  setAccounts,
                  accountsRef
                );
              }
            }
          )) as () => void;

          // update context state
          setStateWithRef(
            [...unsubscribeRef.current].concat({
              key: id,
              unsub,
            }),
            setUnsubscribe,
            unsubscribeRef
          );
        }
      } catch (err) {
        handleExtensionError(id, String(err));
      }
    }
  };

  const handleExtensionError = (id: string, err: string) => {
    // authentication error (extension not enabled)
    if (err.substring(0, 9) === 'AuthError') {
      removeFromLocalExtensions(id);
      setExtensionStatus(id, 'not_authenticated');
    }

    // extension not found (does not exist)
    if (err.substring(0, 17) === 'NotInstalledError') {
      removeFromLocalExtensions(id);
      setExtensionStatus(id, 'not_found');
    }

    // general error (maybe enabled but no accounts trust app)
    if (err.substring(0, 5) === 'Error') {
      setExtensionStatus(id, 'no_accounts');
    }
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

  const connectToAccount = (account: ImportedAccount | null) => {
    setActiveAccount(account?.address ?? null);
    setStateWithRef(account, setActiveAccountMeta, activeAccountMetaRef);
  };

  const disconnectFromAccount = () => {
    localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
    setActiveAccount(null);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
  };

  const getAccount = (addr: MaybeAccount) => {
    const acc =
      accountsRef.current.find((a: ImportedAccount) => a?.address === addr) ||
      null;
    return acc;
  };

  const getActiveAccount = () => {
    return activeAccountRef.current;
  };

  // adds an external account (non-wallet) to accounts
  const addExternalAccount = (address: string, addedBy: string) => {
    // ensure account is formatted correctly
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);
    const formatted = keyring.addFromAddress(address).address;

    const externalAccount = {
      address: formatted,
      network: network.name,
      name: clipAddress(address),
      source: 'external',
      addedBy,
    };

    // get all external accounts from localStorage
    const localExternalAccounts = getLocalExternalAccounts(network, false);
    const exists = localExternalAccounts.find(
      (l: ExternalAccount) =>
        l.address === address && l.network === network.name
    );

    // add external account to localStorage if not there already
    if (!exists) {
      const localExternal = localExternalAccounts.concat(externalAccount);
      localStorage.setItem('external_accounts', JSON.stringify(localExternal));
    }

    // add external account to imported accounts
    setStateWithRef(
      [...accountsRef.current].concat(externalAccount),
      setAccounts,
      accountsRef
    );
  };

  // checks whether an account can sign transactions
  const accountHasSigner = (address: MaybeAccount) => {
    const exists =
      accountsRef.current.find(
        (a: ImportedAccount) => a.address === address && a.source !== 'external'
      ) !== undefined;
    return exists;
  };

  const isReadOnlyAccount = (address: MaybeAccount) => {
    const account = getAccount(address) ?? {};

    if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
      const { addedBy } = account as ExternalAccount;
      return addedBy === 'user';
    }
    return false;
  };

  // check an account balance exists on-chain
  const formatAccountSs58 = (address: string) => {
    try {
      const keyring = new Keyring();
      keyring.setSS58Format(network.ss58);
      const formatted = keyring.addFromAddress(address).address;
      if (formatted !== address) {
        return formatted;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  return (
    <ConnectContext.Provider
      value={{
        formatAccountSs58,
        connectExtensionAccounts,
        getAccount,
        connectToAccount,
        disconnectFromAccount,
        addExternalAccount,
        getActiveAccount,
        accountHasSigner,
        isReadOnlyAccount,
        forgetAccounts,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
