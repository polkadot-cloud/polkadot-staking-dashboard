// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@polkadot/api/types';
import Keyring from '@polkadot/keyring';
import {
  clipAddress,
  localStorageOrDefault,
  setStateWithRef,
} from '@polkadotcloud/utils';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import type {
  ConnectContextInterface,
  ExternalAccount,
  ImportedAccount,
} from 'contexts/Connect/types';
import { useExtensions } from 'contexts/Extensions';
import type {
  ExtensionInjected,
  ExtensionInterface,
} from 'contexts/Extensions/types';
import {
  getLocalLedgerAccounts,
  getLocalVaultAccounts,
} from 'contexts/Hardware/Utils';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import { useImportExtension } from './Hooks/useImportExtension';
import {
  extensionIsLocal,
  getActiveAccountLocal,
  getLocalExternalAccounts,
  manualSigners,
  removeFromLocalExtensions,
  removeLocalExternalAccounts,
} from './Utils';
import { defaultConnectContext } from './defaults';

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
  const [accounts, setAccounts] = useState<ImportedAccount[]>([]);
  const accountsRef = useRef(accounts);

  // store the currently active account
  const [activeAccount, setActiveAccountState] = useState<MaybeAccount>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // store the active proxy account
  const [activeProxy, setActiveProxyState] = useState<MaybeAccount>(null);
  const activeProxyRef = useRef(activeProxy);

  const setActiveProxy = (proxy: MaybeAccount, updateLocal = true) => {
    if (updateLocal) {
      if (proxy) {
        localStorage.setItem(`${network.name}_active_proxy`, proxy);
      } else {
        localStorage.removeItem(`${network.name}_active_proxy`);
      }
    }
    setStateWithRef(proxy, setActiveProxyState, activeProxyRef);
  };

  // store unsubscribe handlers for connected extensions.
  const unsubs = useRef<Record<string, VoidFn>>({});

  // store extensions whose account subscriptions have been initialised
  const [extensionsInitialised, setExtensionsInitialised] = useState<AnyApi[]>(
    []
  );
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
      setStateWithRef(null, setActiveAccountState, activeAccountRef);
      setStateWithRef([], setAccounts, accountsRef);
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
      importVaultAccounts();
      importLedgerAccounts();
      importExternalAccounts();
    }
  }, [extensionsFetched]);

  /*
   * Unsubscrbe all account subscriptions
   */
  const unsubscribeAll = () => {
    Object.values(unsubs.current).forEach((unsub) => {
      unsub();
    });
  };

  /*
   * Unsubscrbe from some account subscriptions and update the resulting state.
   */
  const forgetAccounts = (forget: ImportedAccount[]) => {
    if (!forget.length) return;

    for (const { address } of forget) {
      const unsub = unsubs.current[address];
      if (unsub) {
        unsub();
        delete unsubs.current[address];
      }
    }

    // if active account is being forgotten, disconnect
    const activeAccountUnsub = forget.find(
      (a: ImportedAccount) => a.address === activeAccountRef.current
    );

    if (activeAccountUnsub !== undefined) {
      localStorage.removeItem(`${network.name}_active_account`);
      setStateWithRef(null, setActiveAccount, activeAccountRef);
    }

    // get any external accounts and remove from localStorage
    const externalToForget = forget.filter(
      (i: AnyApi) => 'network' in i
    ) as ExternalAccount[];

    if (externalToForget.length) {
      removeLocalExternalAccounts(network, externalToForget);
    }

    // update accounts.
    setStateWithRef(
      [...accountsRef.current].filter(
        (a) => forget.find((e) => e.address === a.address) === undefined
      ),
      setAccounts,
      accountsRef
    );
  };

  // renames an account
  const renameImportedAccount = (address: MaybeAccount, newName: string) => {
    setStateWithRef(
      [...accountsRef.current].map((a) =>
        a.address !== address
          ? a
          : {
              ...a,
              name: newName,
            }
      ),
      setAccounts,
      accountsRef
    );
  };

  /* importLedgerAccounts
   * Checks previously added Ledger accounts from localStorage and adds them to
   * `accounts` state. if local active account is present, it will also be assigned as active.
   * Accounts are ignored if they are already imported through an extension. */
  const importLedgerAccounts = () => {
    // import any local external accounts
    let localAccounts = getLocalLedgerAccounts(network.name);

    if (localAccounts.length) {
      const activeAccountInSet =
        localAccounts.find(
          ({ address }) => address === getActiveAccountLocal(network)
        ) ?? null;

      // remove already-imported accounts
      localAccounts = localAccounts.filter(
        (l) =>
          accountsRef.current.find(({ address }) => address === l.address) ===
          undefined
      );

      // set active account for network
      if (activeAccountInSet) {
        connectToAccount(activeAccountInSet);
      }
      // add Ledger accounts to imported
      addToAccounts(localAccounts);
    }
  };

  /* importVaultAccounts
   * Checks previously added Polkadot Vault accounts from localStorage and adds them to
   * `accounts` state. if local active account is present, it will also be assigned as active.
   * Accounts are ignored if they are already imported through an extension. */
  const importVaultAccounts = () => {
    // import any local external accounts
    let localAccounts = getLocalVaultAccounts(network.name);

    if (localAccounts.length) {
      const activeAccountInSet =
        localAccounts.find(
          ({ address }) => address === getActiveAccountLocal(network)
        ) ?? null;

      // remove already-imported accounts
      localAccounts = localAccounts.filter(
        (l) =>
          accountsRef.current.find(({ address }) => address === l.address) ===
          undefined
      );

      // set active account for network
      if (activeAccountInSet) {
        connectToAccount(activeAccountInSet);
      }
      // add Ledger accounts to imported
      addToAccounts(localAccounts);
    }
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
    let localAccounts = getLocalExternalAccounts(network, true);

    if (localAccounts.length) {
      const activeAccountInSet =
        localAccounts.find(
          ({ address }) => address === getActiveAccountLocal(network)
        ) ?? null;

      // remove already-imported accounts
      localAccounts = localAccounts.filter(
        (l) =>
          accountsRef.current.find(({ address }) => address === l.address) ===
          undefined
      );

      // set active account for network
      if (activeAccountInSet) {
        connectToAccount(activeAccountInSet);
      }
      // add external accounts to imported
      addToAccounts(localAccounts);
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
  const connectExtensionAccounts = async (
    e: ExtensionInjected
  ): Promise<boolean> => {
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
          return true;
        }
      } catch (err) {
        handleExtensionError(id, String(err));
      }
    }
    return false;
  };

  const handleExtensionError = (id: string, err: string) => {
    // if not general error (maybe enabled but no accounts trust app)
    if (err.startsWith('Error')) {
      // remove extension from local `active_extensions`.
      removeFromLocalExtensions(id);

      // extension not found (does not exist)
      if (err.substring(0, 17) === 'NotInstalledError') {
        setExtensionStatus(id, 'not_found');
      } else {
        // declare extension as no imported accounts authenticated.
        setExtensionStatus(id, 'not_authenticated');
      }
    }
    // mark extension as initialised
    updateInitialisedExtensions(id);
  };

  const setActiveAccount = (address: string | null) => {
    if (address === null) {
      localStorage.removeItem(`${network.name}_active_account`);
    } else {
      localStorage.setItem(`${network.name}_active_account`, address);
    }
    setStateWithRef(address, setActiveAccountState, activeAccountRef);
  };

  const connectToAccount = (account: ImportedAccount | null) => {
    setActiveAccount(account?.address ?? null);
  };

  const disconnectFromAccount = () => {
    localStorage.removeItem(`${network.name}_active_account`);
    setActiveAccount(null);
  };

  const getAccount = (who: MaybeAccount) =>
    accountsRef.current.find(({ address }) => address === who) || null;

  const getActiveAccount = () => activeAccountRef.current;

  // adds an external account (non-wallet) to accounts
  const addExternalAccount = (address: string, addedBy: string) => {
    // ensure account is formatted correctly
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);
    const formatted = keyring.addFromAddress(address).address;

    const newAccount = {
      address: formatted,
      network: network.name,
      name: clipAddress(address),
      source: 'external',
      addedBy,
    };

    // get all external accounts from localStorage.
    const localExternalAccounts = getLocalExternalAccounts(network, false);
    const existsLocal = localExternalAccounts.find(
      (l) => l.address === address && l.network === network.name
    );

    // check that address is not sitting in imported accounts (currently cannot check which
    // network).
    const existsImported = accountsRef.current.find(
      (a) => a.address === address
    );

    // add external account if not there already.
    if (!existsLocal && !existsImported) {
      localStorage.setItem(
        'external_accounts',
        JSON.stringify(localExternalAccounts.concat(newAccount))
      );

      // add external account to imported accounts
      addToAccounts([newAccount]);
    } else if (existsLocal && existsLocal.addedBy !== 'system') {
      // the external account needs to change to `system` so it cannot be removed. This will replace
      // the whole entry.
      localStorage.setItem(
        'external_accounts',
        JSON.stringify(
          localExternalAccounts.map((item) =>
            item.address !== address ? item : newAccount
          )
        )
      );
      // refresh accounts state.
      replaceAccount(newAccount);
    }
  };

  // Checks whether an account can sign transactions
  const accountHasSigner = (address: MaybeAccount) =>
    accountsRef.current.find(
      (a) => a.address === address && a.source !== 'external'
    ) !== undefined;

  // Checks whether an account needs manual signing. This is the case for Ledger accounts,
  // transactions of which cannot be automatically signed by a provided `signer` as is the case with
  // extensions.
  const requiresManualSign = (address: MaybeAccount) =>
    accountsRef.current.find(
      (a) => a.address === address && manualSigners.includes(a.source)
    ) !== undefined;

  const isReadOnlyAccount = (address: MaybeAccount) => {
    const account = getAccount(address) ?? {};

    if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
      const { addedBy } = account as ExternalAccount;
      return addedBy === 'user';
    }
    return false;
  };

  // formats an address into the currently active network's ss58 format.
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

  // update initialised extensions.
  const updateInitialisedExtensions = (id: string) => {
    if (!extensionsInitialisedRef.current.includes(id)) {
      setStateWithRef(
        [...extensionsInitialisedRef.current].concat(id),
        setExtensionsInitialised,
        extensionsInitialisedRef
      );
    }
  };

  // add accounts to context state.
  const addToAccounts = (a: ImportedAccount[]) => {
    setStateWithRef(
      [...accountsRef.current].concat(a),
      setAccounts,
      accountsRef
    );
  };

  // replaces an account in context state.
  const replaceAccount = (a: ImportedAccount) => {
    setStateWithRef(
      [...accountsRef.current].map((item) =>
        item.address !== a.address ? item : a
      ),
      setAccounts,
      accountsRef
    );
  };

  // add an extension id to unsubscribe state.
  const addToUnsubscribe = (id: string, unsub: AnyApi) => {
    unsubs.current[id] = unsub;
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
        requiresManualSign,
        isReadOnlyAccount,
        addToAccounts,
        forgetAccounts,
        setActiveProxy,
        renameImportedAccount,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeProxy: activeProxyRef.current,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};

export const ConnectContext = React.createContext<ConnectContextInterface>(
  defaultConnectContext
);

export const useConnect = () => React.useContext(ConnectContext);
