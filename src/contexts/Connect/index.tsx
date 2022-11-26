// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import {
  ConnectContextInterface,
  ExtensionAccount,
  ExternalAccount,
  ImportedAccount,
} from 'contexts/Connect/types';
import { useExtensions } from 'contexts/Extensions';
import { Extension, ExtensionInteface } from 'contexts/Extensions/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import {
  clipAddress,
  isValidAddress,
  localStorageOrDefault,
  setStateWithRef,
} from 'Utils';
import { defaultConnectContext } from './defaults';
import {
  extensionIsLocal,
  getActiveAccountLocal,
  getLocalExternalAccounts,
  removeFromLocalExtensions,
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
    // if extensions have been fetched
    if (extensions) {
      // get account if extensions exist and local extensions exist (previously connected).
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

  /* once extension accounts are synced, fetch
   * any external accounts present in localStorage.
   */
  useEffect(() => {
    // get local external accounts once extension fetching completes
    if (extensionsFetched) {
      importExternalAccounts();
    }
  }, [extensionsFetched]);

  /*
   * Unsubscrbe all account subscriptions
   */
  const unsubscribeAll = () => {
    unsubscribeRef.current.forEach(({ unsub }: AnyApi) => {
      unsub();
    });
  };

  /*
   * Unsubscrbe from some account subscriptions and update the resulting state.
   */
  const forgetAccounts = (_accounts: Array<ExternalAccount>) => {
    if (!_accounts.length) return;
    const keys = _accounts.map((a: ExternalAccount) => a.address);

    // unsubscribe from provided keys
    const unsubs = unsubscribeRef.current.filter((f: AnyApi) =>
      keys.includes(f.key)
    );
    Object.values(unsubs).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
    // filter keys from current unsubs
    const unsubsNew = unsubscribeRef.current.filter(
      (f: AnyApi) => !keys.includes(f.key)
    );

    // if active account is being forgotten, disconnect
    const activeAccountUnsub = _accounts.find(
      (a: ExternalAccount) => a.address === activeAccount
    );
    if (activeAccountUnsub !== undefined) {
      setStateWithRef(null, setActiveAccount, activeAccountRef);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    }

    // update localStorage
    let localExternalAccounts = getLocalExternalAccounts(network, true);

    // remove forgotten accounts from localStorage
    localExternalAccounts = localExternalAccounts.filter(
      (l: ExternalAccount) =>
        _accounts.find(
          (a: ImportedAccount) =>
            a.address === l.address && l.network === network.name
        ) === undefined
    );

    localStorage.setItem(
      'external_accounts',
      JSON.stringify(localExternalAccounts)
    );

    // update accounts
    const accountsNew = accountsRef.current.filter(
      (a: ImportedAccount) =>
        _accounts.find((e: ExternalAccount) => e.address === a.address) ===
        undefined
    );

    setStateWithRef(accountsNew, setAccounts, accountsRef);
    // update unsubs state with filtered unsubs
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
      const _activeAccount = getActiveAccountLocal(network);

      const activeAccountIsExternal =
        localExternalAccounts.find(
          (a: ImportedAccount) => a.address === _activeAccount
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
      const _accounts = [...accountsRef.current].concat(localExternalAccounts);

      // add external accounts to imported
      setStateWithRef(_accounts, setAccounts, accountsRef);
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
    const _activeAccount = getActiveAccountLocal(network);

    // iterate extensions and add accounts to state
    let extensionsCount = 0;
    const totalExtensions = extensions?.length ?? 0;
    let activeWalletAccount: ImportedAccount | null = null;

    if (!extensions) {
      return;
    }

    extensions.forEach(async (_extension: Extension) => {
      extensionsCount++;
      const { id, enable } = _extension;

      // if extension is found locally, subscribe to accounts
      if (extensionIsLocal(id)) {
        try {
          // summons extension popup
          const extension: ExtensionInteface = await enable(DappName);

          if (extension !== undefined) {
            // subscribe to accounts
            const _unsubscribe = (await extension.accounts.subscribe(
              (injected: ExtensionAccount[]) => {
                if (!injected) {
                  return;
                }
                // update extensions status
                updateExtensionStatus(id, 'connected');
                // update local active extensions
                addToLocalExtensions(id);

                // only continue if there are accounts
                if (injected.length) {
                  // remove injected already imported from another extension
                  injected = injected.filter(
                    (i: ExtensionAccount) =>
                      !accountsRef.current
                        .map((j: ImportedAccount) => j.address)
                        .includes(i.address)
                  );

                  // filter injected with correctly formatted addresses
                  injected = injected.filter((i: ExtensionAccount) => {
                    return isValidAddress(i.address);
                  });

                  // format account properties
                  injected = injected.map((a: ExtensionAccount) => {
                    return {
                      address: a.address,
                      source: id,
                      name: a.name,
                      signer: extension.signer,
                    };
                  });

                  // remove any injected accounts from local external if any exist
                  const localExternalAccounts = getLocalExternalAccounts(
                    network,
                    true
                  );
                  const localAccountsToForget =
                    localExternalAccounts.filter(
                      (l: ExternalAccount) =>
                        (injected || []).find(
                          (a: ExtensionAccount) => a.address === l.address
                        ) !== undefined && l.addedBy === 'system'
                    ) || [];

                  forgetAccounts(localAccountsToForget);

                  // reformat address to ensure correct format
                  injected.forEach(async (account: ExtensionAccount) => {
                    const { address } = keyring.addFromAddress(account.address);
                    account.address = address;
                    return account;
                  });
                  // connect to active account if found in extension
                  // TODO: abstract this logic via a flag.
                  const activeAccountInWallet =
                    injected.find(
                      (a: ExtensionAccount) => a.address === _activeAccount
                    ) ?? null;
                  if (activeAccountInWallet !== null) {
                    activeWalletAccount = activeAccountInWallet;
                  }

                  // set active account for network
                  if (
                    extensionsCount === totalExtensions &&
                    activeAccountRef.current === null
                  ) {
                    connectToAccount(activeWalletAccount);
                  }
                  // remove accounts if they already exist
                  let _accounts = [...accountsRef.current].filter(
                    (a: ImportedAccount) => {
                      return a?.source !== id;
                    }
                  );
                  // concat accounts and store
                  _accounts = _accounts.concat(injected);
                  setStateWithRef(_accounts, setAccounts, accountsRef);
                }
              }
            )) as () => void;

            // update context state
            setStateWithRef(
              [...unsubscribeRef.current].concat({
                key: id,
                unsub: _unsubscribe,
              }),
              setUnsubscribe,
              unsubscribeRef
            );
          }
        } catch (err) {
          handleExtensionError(id, String(err));
        }
      }

      // after last extension, import external accounts
      if (extensionsCount === totalExtensions) {
        setExtensionsFetched(true);
      }
    });
  };

  /* connectExtensionAccounts
   * Similar to the above but only connects to a single extension.
   * This is invoked by the user by clicking on an extension.
   * If activeAccount is not found here, it is simply ignored.
   */
  const connectExtensionAccounts = async (_extension: Extension) => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);
    const { id, enable } = _extension;

    const _activeAccount = getActiveAccountLocal(network);
    try {
      // summons extension popup
      const extension: ExtensionInteface = await enable(DappName);

      if (extension !== undefined) {
        // subscribe to accounts
        const _unsubscribe = (await extension.accounts.subscribe(
          (injected: ExtensionAccount[]) => {
            if (!injected) {
              return;
            }
            // update extensions status
            updateExtensionStatus(id, 'connected');
            // update local active extensions
            addToLocalExtensions(id);

            // only continue if there are accounts
            if (injected.length) {
              // remove injected already imported from another extension
              injected = injected.filter(
                (i: ExtensionAccount) =>
                  !accountsRef.current
                    .map((j: ImportedAccount) => j.address)
                    .includes(i.address)
              );

              // filter injected with correctly formatted addresses
              injected = injected.filter((i: ExtensionAccount) => {
                return isValidAddress(i.address);
              });

              // format account properties
              injected = injected.map((a: ExtensionAccount) => {
                return {
                  address: a.address,
                  source: id,
                  name: a.name,
                  signer: extension.signer,
                };
              });

              // remove injected if they exist in local external accounts
              const localExternalAccounts = getLocalExternalAccounts(
                network,
                true
              );

              const localAccountsToForget =
                localExternalAccounts.filter(
                  (l: ExternalAccount) =>
                    (injected || []).find(
                      (a: ExtensionAccount) => a.address === l.address
                    ) !== undefined && l.addedBy === 'system'
                ) || [];

              forgetAccounts(localAccountsToForget);

              // reformat address to ensure correct format
              injected.forEach(async (account: ExtensionAccount) => {
                const { address } = keyring.addFromAddress(account.address);
                account.address = address;
                return account;
              });

              // connect to active account if found in extension
              const activeAccountInWallet =
                injected.find(
                  (a: ExtensionAccount) => a.address === _activeAccount
                ) ?? null;
              if (activeAccountInWallet !== null) {
                connectToAccount(activeAccountInWallet);
              }

              // remove accounts if they already exist
              let _accounts = [...accountsRef.current].filter(
                (a: ImportedAccount) => {
                  return a?.source !== id;
                }
              );
              // concat accounts and store
              _accounts = _accounts.concat(injected);
              setStateWithRef(_accounts, setAccounts, accountsRef);
            }
          }
        )) as () => void;

        // update context state
        setStateWithRef(
          [...unsubscribeRef.current].concat({
            key: id,
            unsub: _unsubscribe,
          }),
          setUnsubscribe,
          unsubscribeRef
        );
      }
    } catch (err) {
      handleExtensionError(id, String(err));
    }
  };

  const handleExtensionError = (id: string, err: string) => {
    // authentication error (extension not enabled)
    if (err.substring(0, 9) === 'AuthError') {
      removeFromLocalExtensions(id);
      updateExtensionStatus(id, 'not_authenticated');
    }

    // extension not found (does not exist)
    if (err.substring(0, 17) === 'NotInstalledError') {
      removeFromLocalExtensions(id);
      updateExtensionStatus(id, 'not_found');
    }

    // general error (maybe enabled but no accounts trust app)
    if (err.substring(0, 5) === 'Error') {
      updateExtensionStatus(id, 'no_accounts');
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

  const updateExtensionStatus = (id: string, status: string) => {
    setExtensionStatus(id, status);
  };

  const addToLocalExtensions = (id: string) => {
    const localExtensions = localStorageOrDefault<string[]>(
      `active_extensions`,
      [],
      true
    );

    if (Array.isArray(localExtensions)) {
      if (!localExtensions.includes(id)) {
        localExtensions.push(id);
        localStorage.setItem(
          'active_extensions',
          JSON.stringify(localExtensions)
        );
      }
    }
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
  const addExternalAccount = (_address: string, addedBy: string) => {
    // ensure account is formatted correctly
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);
    const { address } = keyring.addFromAddress(_address);

    const externalAccount = {
      address,
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
      const _localExternal = localExternalAccounts.concat(externalAccount);
      localStorage.setItem('external_accounts', JSON.stringify(_localExternal));
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
  const formatAccountSs58 = (_address: string) => {
    try {
      const keyring = new Keyring();
      keyring.setSS58Format(network.ss58);
      const { address } = keyring.addFromAddress(_address);
      if (address !== _address) {
        return address;
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
