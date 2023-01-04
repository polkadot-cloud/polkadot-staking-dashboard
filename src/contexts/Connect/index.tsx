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
  ExtensionInjected,
  ExtensionInterface,
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
    checkingInjectedWeb3,
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

  // store extensions whose account subscriptions have been initialised
  const [extensionsInitialised, setExtensionsInitialised] = useState<
    Array<AnyApi>
  >([]);
  const extensionsInitialisedRef = useRef(extensionsInitialised);

  /* re-sync extensions accounts on network switch
   * do this if activeAccount is present.
   * if activeAccount is present, and extensions have for some
   * reason forgot the site, then all pop-ups will be summoned
   * here.
   */
  useEffect(() => {
    // wait for injectedWeb3 check to finish before starting
    // account import process.
    if (!checkingInjectedWeb3) {
      // unsubscribe from all accounts and reset state
      unsubscribeAll();
      setStateWithRef(null, _setActiveAccount, activeAccountRef);
      setStateWithRef([], setAccounts, accountsRef);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
      setStateWithRef([], setExtensionsInitialised, extensionsInitialisedRef);
      setExtensionsFetched(false);

      // if extensions have been fetched, get accounts if extensions exist and
      // local extensions exist (previously connected).
      if (extensions) {
        // get active extensions
        const localExtensions = localStorageOrDefault(
          `active_extensions`,
          [],
          true
        );
        if (extensions.length && localExtensions.length) {
          connectActiveExtensions();
        } else {
          setExtensionsFetched(true);
        }
      }
    }
    return () => {
      unsubscribeAll();
    };
  }, [extensions?.length, network, checkingInjectedWeb3]);

  // once initialised extensions equal total extensions present in
  // `injectedWeb3`, mark extensions as fetched
  useEffect(() => {
    if (!checkingInjectedWeb3) {
      const countExtensions = extensions?.length ?? 0;
      if (extensionsInitialisedRef.current.length === countExtensions) {
        setExtensionsFetched(true);
      }
    }
  }, [extensionsInitialisedRef.current, checkingInjectedWeb3]);

  // once extensions are fully initialised, fetch any external accounts present
  // in localStorage.
  useEffect(() => {
    if (extensionsFetched) {
      importExternalAccounts();
    }
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
  const forgetAccounts = (forget: Array<ImportedAccount>) => {
    if (!forget.length) return;
    const addresses = forget.map((a: ImportedAccount) => a.address);

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
      (a: ImportedAccount) => a.address === activeAccountRef.current
    );

    if (activeAccountUnsub !== undefined) {
      localStorage.removeItem(`${network.name.toLowerCase()}_active_account`);
      setStateWithRef(null, setActiveAccount, activeAccountRef);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    }

    // get any external accounts and remove from localStorage
    const externalToForget = forget.filter(
      (i: AnyApi) => 'network' in i
    ) as Array<ExternalAccount>;

    if (externalToForget.length) {
      removeLocalExternalAccounts(network, externalToForget);
    }

    // update accounts
    const accountsNew = accountsRef.current.filter(
      (a: ImportedAccount) =>
        forget.find((e: ImportedAccount) => e.address === a.address) ===
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
      addToAccounts(localExternalAccounts);
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

      // whether extension is locally stored (previously connected)
      const isLocal = extensionIsLocal(id ?? 0);

      if (!id || !isLocal) {
        updateInitialisedExtensions(
          id ||
            `unknown_extension_${extensionsInitialisedRef.current.length + 1}`
        );
      } else {
        try {
          // attempt to get extension `enable` property
          const { enable } = e;

          // summons extension popup
          const extension: ExtensionInterface = await enable(DappName);

          if (extension !== undefined) {
            const unsub = extension.accounts.subscribe((a) => {
              if (a) {
                const { newAccounts, meta } = handleImportExtension(
                  id,
                  accountsRef.current,
                  extension,
                  a,
                  forgetAccounts
                );

                // store active wallet account if found in this extension
                if (!activeWalletAccount) {
                  activeWalletAccount = getActiveExtensionAccount(newAccounts);
                }
                // set active account for network on final extension
                if (i === total && activeAccountRef.current === null) {
                  const activeAccountRemoved =
                    activeWalletAccount?.address !==
                      meta.removedActiveAccount &&
                    meta.removedActiveAccount !== null;

                  if (!activeAccountRemoved) {
                    connectActiveExtensionAccount(
                      activeWalletAccount,
                      connectToAccount
                    );
                  }
                }

                // concat accounts and store
                addToAccounts(newAccounts);

                // update initialised extensions
                updateInitialisedExtensions(id);
              }
            });

            addToUnsubscribe(id, unsub);
          }
        } catch (err) {
          handleExtensionError(id, String(err));
        }
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

    if (!id) {
      updateInitialisedExtensions(
        `unknown_extension_${extensionsInitialisedRef.current.length + 1}`
      );
    } else {
      try {
        // attempt to get extension `enable` property
        const { enable } = e;

        // summons extension popup
        const extension: ExtensionInterface = await enable(DappName);

        if (extension !== undefined) {
          // subscribe to accounts
          const unsub = extension.accounts.subscribe((a) => {
            if (a) {
              const { newAccounts, meta } = handleImportExtension(
                id,
                accountsRef.current,
                extension,
                a,
                forgetAccounts
              );
              // set active account for network if not yet set
              if (activeAccountRef.current === null) {
                const activeExtensionAccount =
                  getActiveExtensionAccount(newAccounts);

                if (
                  activeExtensionAccount !== meta.removedActiveAccount &&
                  meta.removedActiveAccount !== null
                )
                  connectActiveExtensionAccount(
                    activeExtensionAccount,
                    connectToAccount
                  );
              }
              // concat accounts and store
              addToAccounts(newAccounts);

              // update initialised extensions
              updateInitialisedExtensions(id);
            }
          });

          addToUnsubscribe(id, unsub);
        }
      } catch (err) {
        handleExtensionError(id, String(err));
      }
    }
  };

  const handleExtensionError = (id: string, err: string) => {
    // general error (maybe enabled but no accounts trust app)
    if (err.substring(0, 5) === 'Error') {
      setExtensionStatus(id, 'no_accounts');
    } else {
      // remove extension from local `active_extensions`.
      removeFromLocalExtensions(id);

      // authentication error (extension not enabled)
      if (err.substring(0, 9) === 'AuthError') {
        setExtensionStatus(id, 'not_authenticated');
      }
      // extension not found (does not exist)
      if (err.substring(0, 17) === 'NotInstalledError') {
        setExtensionStatus(id, 'not_found');
      }
    }
    // mark extension as initialised
    updateInitialisedExtensions(id);
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
    addToAccounts([externalAccount]);
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

  // update initialised extensions
  const updateInitialisedExtensions = (id: string) => {
    if (!extensionsInitialisedRef.current.includes(id)) {
      setStateWithRef(
        [...extensionsInitialisedRef.current].concat(id),
        setExtensionsInitialised,
        extensionsInitialisedRef
      );
    }
  };

  // add accounts to context state
  const addToAccounts = (a: Array<ImportedAccount>) => {
    setStateWithRef(
      [...accountsRef.current].concat(a),
      setAccounts,
      accountsRef
    );
  };

  // add an accounts subscription to unsubscribe state
  const addToUnsubscribe = (id: string, unsub: AnyApi) => {
    setStateWithRef(
      [...unsubscribeRef.current].concat({
        key: id,
        unsub,
      }),
      setUnsubscribe,
      unsubscribeRef
    );
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
