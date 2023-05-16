// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@polkadot/api/types';
import Keyring from '@polkadot/keyring';
import {
  clipAddress,
  localStorageOrDefault,
  setStateWithRef,
} from '@polkadotcloud/utils';
import type SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types/';
import { Web3Modal } from '@web3modal/standalone';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import type {
  ConnectContextInterface,
  ExternalAccount,
  ImportedAccount,
} from 'contexts/Connect/types';
import { useExtensions } from 'contexts/Extensions';
import type {
  ExtensionAccount,
  ExtensionInjected,
  ExtensionInterface,
} from 'contexts/Extensions/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import { useImportExtension } from './Hooks/useImportExtension';
import {
  extensionIsLocal,
  getActiveAccountLocal,
  getLocalExternalAccounts,
  getLocalLedgerAccounts,
  removeFromLocalExtensions,
  removeLocalExternalAccounts,
} from './Utils';
import { WalletConnect } from './WalletConnect';
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

  // store the currently active account metadata
  const [activeAccountMeta, setActiveAccountMeta] =
    useState<ImportedAccount | null>(null);
  const activeAccountMetaRef = useRef(activeAccountMeta);

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

  const [client, setWalletConnectClient] = useState<SignClient | null>(null);
  const [session, setWalletConnectSession] =
    useState<SessionTypes.Struct | null>(null);
  const [wcChainInfo, setWalletConnectChainInfo] = useState<string | null>(
    null
  );

  const getWalletConnectClient = () => {
    return client;
  };

  const getWalletConnectSession = () => {
    return session;
  };

  const getWalletConnectChainInfo = () => {
    return wcChainInfo;
  };

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

  // once initialised extensions equal total extensions present in `injectedWeb3`, mark extensions
  // as fetched.
  useEffect(() => {
    if (!checkingInjectedWeb3) {
      const countExtensions = extensions?.length ?? 0;
      if (extensionsInitialisedRef.current.length === countExtensions) {
        setExtensionsFetched(true);
      }
    }
  }, [extensionsInitialisedRef.current, checkingInjectedWeb3]);

  // once extensions are fully initialised, fetch any ledger accounts and external accounts present
  // in localStorage.
  useEffect(() => {
    if (extensionsFetched) {
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
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
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

  /* importLedgerAccounts
   * Checks previously added Ledger accounts from localStorage and adds them to
   * `accounts` state. if local active account is present, it will also be assigned as active.
   * Accounts are ignored if they are already imported through an extension. */
  const importLedgerAccounts = () => {
    // import any local external accounts
    let localLedgerAccounts = getLocalLedgerAccounts(network, true);

    if (localLedgerAccounts.length) {
      // get and format active account if present
      const activeAccountLocal = getActiveAccountLocal(network);

      const activeAccountIsExternal =
        localLedgerAccounts.find((a) => a.address === activeAccountLocal) ??
        null;

      // remove already-imported accounts
      localLedgerAccounts = localLedgerAccounts.filter(
        (l) =>
          accountsRef.current.find((a) => a.address === l.address) === undefined
      );

      // set active account for network
      if (activeAccountIsExternal) {
        connectToAccount(activeAccountIsExternal);
      }
      // add Ledger accounts to imported
      addToAccounts(localLedgerAccounts);
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
    let localExternalAccounts = getLocalExternalAccounts(network, true);

    if (localExternalAccounts.length) {
      // get and format active account if present
      const activeAccountLocal = getActiveAccountLocal(network);

      const activeAccountIsExternal =
        localExternalAccounts.find((a) => a.address === activeAccountLocal) ??
        null;

      // remove already-imported accounts
      localExternalAccounts = localExternalAccounts.filter(
        (l) =>
          accountsRef.current.find((a) => a.address === l.address) === undefined
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
      } else if (id === 'wallet-connect') {
        // initialise wallet connect.
        initialiseWalletConnect(id, activeWalletAccount, i, total);
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

  /* initialiseWalletConnect: Handles the initialisation of wallet connect. This is done after web
   * extensions have been fetched.
   */
  const initialiseWalletConnect = async (
    id: string,
    activeWalletAccount: ImportedAccount | null,
    i: number,
    total: number
  ) => {
    const wcSessionStorage = localStorage.getItem('WalletConnectSession');

    // If there is a session stored in local storage, we will try to connect to it.
    if (wcSessionStorage) {
      const existingSession: SessionTypes.Struct = {
        ...JSON.parse(wcSessionStorage),
      };
      setWalletConnectSession(existingSession);

      const expiryDate = new Date(existingSession.expiry * 1000);
      const currentDate = new Date();
      if (expiryDate < currentDate) {
        localStorage.removeItem('WalletConnectSession');
        setWalletConnectSession(null);
        return;
      }

      const provider = await WalletConnect.initialize();
      setWalletConnectClient(provider.client);

      // handle Wallet Connect session delete event
      provider.on('session_delete', () => {
        handleWalletConnectSessionDelete(id);
      });

      const currentCaipChain = `polkadot:${network.namespace}`;
      setWalletConnectChainInfo(currentCaipChain);

      const wcAccounts = WalletConnect.getAccounts(existingSession);
      const walletConnectAccountAddresses = wcAccounts.map(
        (walletAccount: string) => {
          return {
            source: '',
            addedBy: '',
            address: walletAccount,
            meta: provider.client.metadata,
            name: `Wallet Connect:${walletAccount}`,
            signer: provider.client,
          };
        }
      );

      const walletConnectAccountsSub = {
        // eslint-disable-next-line
        subscribe: (a: { (a: ExtensionAccount[]): void }) => {},
      };

      const extension: ExtensionInterface = {
        provider,
        accounts: walletConnectAccountsSub,
        metadata: provider.client.metadata,
        signer: provider.client,
      };

      const { newAccounts, meta } = handleImportExtension(
        id,
        accountsRef.current,
        extension,
        walletConnectAccountAddresses,
        forgetAccounts
      );

      // store active wallet account if found in this extension
      if (!activeWalletAccount) {
        activeWalletAccount = getActiveExtensionAccount(newAccounts);
      }

      // set active account for network on final extension
      if (i === total && activeAccountRef.current === null) {
        const activeAccountRemoved =
          activeWalletAccount?.address !== meta.removedActiveAccount &&
          meta.removedActiveAccount !== null;

        if (!activeAccountRemoved) {
          connectActiveExtensionAccount(activeWalletAccount, connectToAccount);
        }
      }

      // concat accounts and store
      addToAccounts(newAccounts);

      // update initialised extensions
      updateInitialisedExtensions(id);
    }
  };

  const handleWalletConnectSessionDelete = (id: string) => {
    localStorage.removeItem('WalletConnectSession');
    setWalletConnectSession(null);
    setWalletConnectChainInfo(null);
    setWalletConnectClient(null);

    // remove wallet connect accounts from state
    setStateWithRef(
      [...accountsRef.current].filter((account) => account.source !== id),
      setAccounts,
      accountsRef
    );

    setStateWithRef(
      [...extensionsInitialisedRef.current].filter(
        (account) => account.source !== id
      ),
      setExtensionsInitialised,
      extensionsInitialisedRef
    );

    // remove wallet conenct from local extensions
    removeFromLocalExtensions(id);
    setExtensionStatus(id, 'disconnected');

    // remove active account if from wallet connect
    if (
      activeAccountMetaRef.current &&
      activeAccountMetaRef.current.source === 'wallet-connect'
    ) {
      setActiveAccount(null);
      setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
    }
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

  /* connectWalletConnectExtensionAccounts
   * Similar to the above but handles connecting to wallet connect.
   * This is invoked by the user by clicking on the wallet connect extension.
   * If activeAccount is not found here, it is simply ignored.
   */
  const connectWalletConnectExtensionAccounts = async (id: string) => {
    const provider = await WalletConnect.initialize();
    setWalletConnectClient(provider.client);

    const chainId = `polkadot:${network.namespace}`;
    setWalletConnectChainInfo(chainId);

    const params = {
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: [chainId],
          events: ['chainChanged", "accountsChanged'],
          rpcMap: {
            [network.namespace]: network.endpoints.rpc,
          },
        },
      },
    };

    // initialize accounts
    let wcAccounts: string[] = [];
    // Subscribe for pairing URI
    const { uri, approval } = await provider.client.connect(params);
    const web3modal = new Web3Modal({
      projectId: 'f75434b01141677e4ee7ddf70fee56b4',
      walletConnectVersion: 2,
    });
    try {
      if (uri) {
        web3modal.openModal({ uri });
      }
      // Await session approval from the wallet.
      const wcSession = await approval();

      // handle Wallet Connect session delete event
      provider.on('session_delete', () => {
        handleWalletConnectSessionDelete(id);
      });

      setWalletConnectSession(wcSession as SessionTypes.Struct);
      localStorage.setItem('WalletConnectSession', JSON.stringify(wcSession));

      // get accounts
      wcAccounts = WalletConnect.getAccounts(wcSession as SessionTypes.Struct);
      const walletConnectAccountAddresses = wcAccounts.map(
        (walletAccount: string) => {
          return {
            source: '',
            addedBy: '',
            address: walletAccount,
            meta: provider.client.metadata,
            name: `Wallet Connect:${walletAccount}`,
            signer: provider.client,
          };
        }
      );
      const walletConnectAccountsSub = {
        // eslint-disable-next-line
        subscribe: (a: { (a: ExtensionAccount[]): void }) => {},
      };

      const extension: ExtensionInterface = {
        provider,
        accounts: walletConnectAccountsSub,
        metadata: provider.client.metadata,
        signer: provider.client,
      };

      const { newAccounts, meta } = handleImportExtension(
        id,
        accountsRef.current,
        extension,
        walletConnectAccountAddresses,
        forgetAccounts
      );

      //   // set active account for network if not yet set
      if (activeAccountRef.current === null) {
        const activeExtensionAccount = getActiveExtensionAccount(newAccounts);

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
      // });
      addToUnsubscribe(id, () => {});
      // });
    } catch (err) {
      handleExtensionError(id, String(err));
    } finally {
      web3modal.closeModal();
    }
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
    setStateWithRef(account, setActiveAccountMeta, activeAccountMetaRef);
  };

  const disconnectFromAccount = () => {
    localStorage.removeItem(`${network.name}_active_account`);
    setActiveAccount(null);
    setStateWithRef(null, setActiveAccountMeta, activeAccountMetaRef);
  };

  const getAccount = (addr: MaybeAccount) =>
    accountsRef.current.find((a) => a.address === addr) || null;

  const getActiveAccount = () => activeAccountRef.current;

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
      (l) => l.address === address && l.network === network.name
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
  const accountHasSigner = (address: MaybeAccount) =>
    accountsRef.current.find(
      (a) => a.address === address && a.source !== 'external'
    ) !== undefined;

  // Checks whether an account needs manual signing. This is the case for Ledger accounts,
  // transactions of which cannot be automatically signed by a provided `signer` as is the case with
  // extensions.
  const requiresManualSign = (address: MaybeAccount) =>
    accountsRef.current.find(
      (a) => a.address === address && a.source === 'ledger'
    ) !== undefined;

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
  const addToAccounts = (a: ImportedAccount[]) => {
    setStateWithRef(
      [...accountsRef.current].concat(a),
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
        connectWalletConnectExtensionAccounts,
        getAccount,
        getWalletConnectClient,
        getWalletConnectSession,
        getWalletConnectChainInfo,
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
        accounts: accountsRef.current,
        activeAccount: activeAccountRef.current,
        activeProxy: activeProxyRef.current,
        activeAccountMeta: activeAccountMetaRef.current,
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
