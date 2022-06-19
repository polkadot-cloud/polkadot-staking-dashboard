// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import Keyring from '@polkadot/keyring';
import {
  getWalletBySource,
  getWallets,
  WalletAccount,
  Wallet,
} from '@talisman-connect/wallets';
import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { DAPP_NAME } from 'consts';
import { APIContextInterface } from 'types/api';
import {
  ConnectContextInterface,
  ImportedAccount,
  ExternalAccount,
} from 'types/connect';
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
  const [accounts, setAccounts] = useState<Array<ImportedAccount>>([]);
  const accountsRef = useRef(accounts);

  // store the currently active account
  const [activeAccount, _setActiveAccount] = useState<string | null>(null);
  const activeAccountRef = useRef<string | null>(activeAccount);

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] =
    useState<ImportedAccount | null>(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

  // store whether extensions have been fetched
  const [extensionsFetched, setExtensionsFetched] = useState(false);

  // store available extensions in state
  const [extensions, setExtensions] = useState<Array<Wallet>>([]);

  // store extensions metadata in state
  const [extensionsStatus, setExtensionsStatus] = useState<{
    [key: string]: string;
  }>({});
  const extensionsStatusRef = useRef(extensionsStatus);

  // store unsubscribe handler for connected extensions
  const [unsubscribe, setUnsubscribe] = useState<
    Array<{
      key: string;
      unsub: () => void;
    }>
  >([]);
  const unsubscribeRef = useRef(unsubscribe);

  // initialise extensions
  useEffect(() => {
    if (!extensions.length) {
      setExtensions(getWallets());
    }
    return () => {
      unsubscribeRef.current.forEach(({ unsub }) => {
        unsub();
      });
    };
  });

  /* re-sync extensions accounts on network switch
   * do this if activeAccount is present.
   * if activeAccount is present, and extensions have for some
   * reason forgot the site, then all pop-ups will be summoned
   * here. */
  useEffect(() => {
    // get active extensions
    const localExtensions = localStorageOrDefault(
      `active_extensions`,
      [],
      true
    );

    // unsubscribe from all accounts and reset state
    unsubscribeRef.current.forEach(({ unsub }) => {
      unsub();
    });
    setStateWithRef(null, _setActiveAccount, activeAccountRef);
    setStateWithRef([], setAccounts, accountsRef);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    setExtensionsFetched(false);

    // get account if extensions exist and local extensions exist (previously connected).
    if (extensions.length && localExtensions.length) {
      setTimeout(() => connectActiveExtensions(), 200);
    } else {
      setExtensionsFetched(true);
    }
  }, [extensions, network]);

  useEffect(() => {
    // get local external accounts if no extensions
    if (extensionsFetched) {
      importExternalAccounts();
    }
  }, [extensionsFetched]);

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
    let localExternalAccounts = getLocalExternalAccounts(true);

    if (localExternalAccounts.length) {
      // get and format active account if present
      const _activeAccount = getActiveAccountLocal();

      const activeAccountIsExternal =
        localExternalAccounts.find(
          (a: ImportedAccount) => a.address === _activeAccount
        ) ?? null;

      // remove already-imported accounts (extensions may have already imported)
      localExternalAccounts = localExternalAccounts.filter(
        (l: ImportedAccount) =>
          accountsRef.current.find(
            (a: ImportedAccount) => a.address === l.address
          )
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

    // get and format active account if present
    const _activeAccount = getActiveAccountLocal();

    // iterate extensions and add accounts to state
    let extensionsCount = 0;
    const totalExtensions = extensions.length;
    let activeWalletAccount: ImportedAccount | null = null;

    extensions.forEach(async (_extension: Wallet) => {
      extensionsCount++;
      const { extensionName } = _extension;

      // connect if extension has been connected to previously
      const localExtensions = localStorageOrDefault<Array<string>>(
        `active_extensions`,
        [],
        true
      );
      let foundExtensionLocally = false;
      if (Array.isArray(localExtensions)) {
        foundExtensionLocally =
          localExtensions.find((l: string) => l === extensionName) !==
          undefined;
      }

      // if extension is found locally, subscribe to accounts
      if (foundExtensionLocally) {
        try {
          const extension: Wallet | undefined =
            getWalletBySource(extensionName);
          if (extension !== undefined) {
            // summons extension popup
            await extension.enable(DAPP_NAME);

            // subscribe to accounts
            const _unsubscribe = (await extension.subscribeAccounts(
              (injected) => {
                // update extensions status
                updateExtensionStatus(extensionName, 'connected');
                // update local active extensions
                addToLocalExtensions(extensionName);

                // abort if no accounts
                if (injected !== undefined && injected.length) {
                  // reformat address to ensure correct format
                  injected.forEach(async (account: WalletAccount) => {
                    const { address } = keyring.addFromAddress(account.address);
                    account.address = address;
                    return account;
                  });
                  // connect to active account if found in extension
                  const activeAccountInWallet =
                    injected.find(
                      (a: WalletAccount) => a.address === _activeAccount
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
                      return a?.source !== extensionName;
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
                key: extensionName,
                unsub: _unsubscribe,
              }),
              setUnsubscribe,
              unsubscribeRef
            );
          }
        } catch (err) {
          handleExtensionError(extensionName, String(err));
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
  const connectExtensionAccounts = async (extensionName: string) => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);
    const _activeAccount = getActiveAccountLocal();
    try {
      const extension: Wallet | undefined = getWalletBySource(extensionName);

      if (extension !== undefined) {
        // summons extension popup
        await extension.enable(DAPP_NAME);

        // subscribe to accounts
        const _unsubscribe = (await extension.subscribeAccounts((injected) => {
          // update extensions status
          updateExtensionStatus(extensionName, 'connected');
          // update local active extensions
          addToLocalExtensions(extensionName);

          // abort if no accounts
          if (injected !== undefined && injected.length) {
            // reformat address to ensure correct format
            injected.forEach(async (account: WalletAccount) => {
              const { address } = keyring.addFromAddress(account.address);
              account.address = address;
              return account;
            });

            // connect to active account if found in extension
            const activeAccountInWallet =
              injected.find(
                (a: WalletAccount) => a.address === _activeAccount
              ) ?? null;
            if (activeAccountInWallet !== null) {
              connectToAccount(activeAccountInWallet);
            }

            // remove accounts if they already exist
            let _accounts = [...accountsRef.current].filter(
              (a: ImportedAccount) => {
                return a?.source !== extensionName;
              }
            );
            // concat accounts and store
            _accounts = _accounts.concat(injected);
            setStateWithRef(_accounts, setAccounts, accountsRef);
          }
        })) as () => void;

        // update context state
        setStateWithRef(
          [...unsubscribeRef.current].concat({
            key: extensionName,
            unsub: _unsubscribe,
          }),
          setUnsubscribe,
          unsubscribeRef
        );
      }
    } catch (err) {
      handleExtensionError(extensionName, String(err));
    }
  };

  const handleExtensionError = (extensionName: string, err: string) => {
    // authentication error (extension not enabled)
    if (err.substring(0, 9) === 'AuthError') {
      removeFromLocalExtensions(extensionName);
      updateExtensionStatus(extensionName, 'not_authenticated');
    }

    // extension not found (does not exist)
    if (err.substring(0, 17) === 'NotInstalledError') {
      removeFromLocalExtensions(extensionName);
      updateExtensionStatus(extensionName, 'not_found');
    }

    // general error (maybe enabled but no accounts trust app)
    if (err.substring(0, 5) === 'Error') {
      updateExtensionStatus(extensionName, 'no_accounts');
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

  const updateExtensionStatus = (extensionName: string, status: string) => {
    setStateWithRef(
      Object.assign(extensionsStatusRef.current, {
        [extensionName]: status,
      }),
      setExtensionsStatus,
      extensionsStatusRef
    );
  };

  const addToLocalExtensions = (extensionName: string) => {
    const localExtensions = localStorageOrDefault<Array<string>>(
      `active_extensions`,
      [],
      true
    );

    if (Array.isArray(localExtensions)) {
      if (!localExtensions.includes(extensionName)) {
        localExtensions.push(extensionName);
        localStorage.setItem(
          'active_extensions',
          JSON.stringify(localExtensions)
        );
      }
    }
  };

  const removeFromLocalExtensions = (extensionName: string) => {
    let localExtensions = localStorageOrDefault<Array<string>>(
      `active_extensions`,
      [],
      true
    );
    if (Array.isArray(localExtensions)) {
      localExtensions = localExtensions.filter(
        (l: string) => l !== extensionName
      );
      localStorage.setItem(
        'active_extensions',
        JSON.stringify(localExtensions)
      );
    }
  };

  const getAccount = (addr: MaybeAccount) => {
    const accs = accountsRef.current.filter(
      (a: ImportedAccount) => a?.address === addr
    );
    if (accs.length) {
      return accs[0];
    }
    return null;
  };

  const getActiveAccount = () => {
    return activeAccountRef.current;
  };

  const getActiveAccountLocal = () => {
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // get and format active account if present
    let _activeAccount = localStorageOrDefault(
      `${network.name.toLowerCase()}_active_account`,
      null
    );
    if (_activeAccount !== null) {
      _activeAccount = keyring.addFromAddress(_activeAccount).address;
    }
    return _activeAccount;
  };

  // adds an external account (non-wallet) to accounts
  const addExternalAccount = (address: string) => {
    const externalAccount = {
      address,
      network: network.name,
      name: clipAddress(address),
      source: 'external',
    };

    // get all external accounts from localStorage
    const localExternalAccounts = getLocalExternalAccounts(false);
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

  // Formats local external accounts using active network ss58 format.
  const getLocalExternalAccounts = (activeNetworkOnly = false) => {
    let localExternalAccounts = localStorageOrDefault<Array<ExternalAccount>>(
      `external_accounts`,
      [],
      true
    ) as Array<ExternalAccount>;

    // only fetch external accounts for active network
    if (activeNetworkOnly) {
      localExternalAccounts = localExternalAccounts.filter(
        (l: ExternalAccount) => l.network === network.name
      );
    }

    return localExternalAccounts;
  };

  // checks whether an account can sign transactions
  const accountHasSigner = (address: MaybeAccount) => {
    const exists =
      accountsRef.current.find(
        (a: ImportedAccount) => a.address === address && a.source !== 'external'
      ) !== undefined;
    return exists;
  };
  return (
    <ConnectContext.Provider
      value={{
        connectExtensionAccounts,
        getAccount,
        connectToAccount,
        disconnectFromAccount,
        addExternalAccount,
        getActiveAccount,
        accountHasSigner,
        extensions,
        extensionsStatus: extensionsStatusRef.current,
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
