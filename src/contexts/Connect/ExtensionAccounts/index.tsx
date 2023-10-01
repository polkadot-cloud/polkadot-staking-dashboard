// // Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// // SPDX-License-Identifier: GPL-3.0-only

// import {
//   useEffectIgnoreInitial,
//   useExtensions,
// } from '@polkadot-cloud/react/hooks';
// import type { VoidFn } from '@polkadot/api/types';
// import { createContext, useContext, useEffect, useRef, useState } from 'react';
// import type { AnyApi } from 'types';
// import type {
//   ExtensionInjected,
//   ExtensionInterface,
// } from '@polkadot-cloud/react/connect/ExtensionsProvider/types';
// import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
// import type { ExtensionAccountsProviderProps } from './types';

// export const ExtensionAccountsProvider = ({
//   children,
//   dappName,
// }: ExtensionAccountsProviderProps) => {
//   const { checkingInjectedWeb3, setExtensionStatus, extensions } =
//     useExtensions();

//   // Store whether extension accounts have been synced.
//   const [extensionAccountsSynced, setExtensionAccountsSynced] =
//     useState<boolean>(false);

//   // Store extensions whose account subscriptions have been initialised.
//   const [extensionsInitialised, setExtensionsInitialised] = useState<AnyApi[]>(
//     []
//   );
//   const extensionsInitialisedRef = useRef(extensionsInitialised);

//   // Store unsubscribe handlers for connected extensions.
//   const unsubs = useRef<Record<string, VoidFn>>({});

//   // connectActiveExtensions
//   //
//   // Connects to extensions that already have been connected to and stored in localStorage. Loop
//   // through extensions and connect to accounts. If `activeAccount` exists locally, we wait until
//   // all extensions are looped before connecting to it; there is no guarantee it still exists - must
//   // explicitly find it.
//   const connectActiveExtensions = async () => {
//     // iterate extensions and add accounts to state
//     const total = extensions?.length ?? 0;
//     let activeWalletAccount: ImportedAccount | null = null;

//     if (!extensions) return;

//     let i = 0;
//     extensions.forEach(async (e: ExtensionInjected) => {
//       i++;

//       // Ensure the extension carries an `id` property.
//       const id = e?.id ?? undefined;

//       // Whether extension is locally stored (previously connected).
//       const isLocal = extensionIsLocal(id ?? 0);

//       if (!id || !isLocal) {
//         updateInitialisedExtensions(
//           id ||
//             `unknown_extension_${extensionsInitialisedRef.current.length + 1}`
//         );
//       } else {
//         try {
//           // Attempt to get extension `enable` property.
//           const { enable } = e;

//           // Summons extension popup.
//           const extension: ExtensionInterface = await enable(dappName);

//           if (extension !== undefined) {
//             const unsub = extension.accounts.subscribe((a) => {
//               if (a) {
//                 const { newAccounts, meta } = handleImportExtension(
//                   id,
//                   accountsRef.current,
//                   extension,
//                   a,
//                   forgetAccounts
//                 );

//                 // Store active wallet account if found in this extension.
//                 if (!activeWalletAccount) {
//                   activeWalletAccount = getActiveExtensionAccount(newAccounts);
//                 }

//                 // Set active account for network on final extension.
//                 if (i === total && activeAccountRef.current === null) {
//                   const activeAccountRemoved =
//                     activeWalletAccount?.address !==
//                       meta.removedActiveAccount &&
//                     meta.removedActiveAccount !== null;

//                   if (!activeAccountRemoved) {
//                     connectActiveExtensionAccount(
//                       activeWalletAccount,
//                       connectToAccount
//                     );
//                   }
//                 }

//                 // Concat accounts and store.
//                 addToAccounts(newAccounts);

//                 // Update initialised extensions.
//                 updateInitialisedExtensions(id);
//               }
//             });

//             addToUnsubscribe(id, unsub);
//           }
//         } catch (err) {
//           handleExtensionError(id, String(err));
//         }
//       }
//     });
//   };

//   // connectExtensionAccounts
//   //
//   // Similar to the above but only connects to a single extension. This is invoked by the user by
//   // clicking on an extension. If activeAccount is not found here, it is simply ignored.
//   const connectExtensionAccounts = async (
//     e: ExtensionInjected
//   ): Promise<boolean> => {
//     // ensure the extension carries an `id` property
//     const id = e?.id ?? undefined;

//     if (!id) {
//       updateInitialisedExtensions(
//         `unknown_extension_${extensionsInitialisedRef.current.length + 1}`
//       );
//     } else {
//       try {
//         // Attempt to get extension `enable` property.
//         const { enable } = e;

//         // Summons extension popup.
//         const extension: ExtensionInterface = await enable(dappName);

//         if (extension !== undefined) {
//           // Subscribe to accounts.
//           const unsub = extension.accounts.subscribe((a) => {
//             if (a) {
//               const { newAccounts, meta } = handleImportExtension(
//                 id,
//                 accountsRef.current,
//                 extension,
//                 a,
//                 forgetAccounts
//               );
//               // Set active account for network if not yet set.
//               if (activeAccountRef.current === null) {
//                 const activeExtensionAccount =
//                   getActiveExtensionAccount(newAccounts);

//                 if (
//                   activeExtensionAccount !== meta.removedActiveAccount &&
//                   meta.removedActiveAccount !== null
//                 )
//                   connectActiveExtensionAccount(
//                     activeExtensionAccount,
//                     connectToAccount
//                   );
//               }
//               // Concat accounts and store.
//               addToAccounts(newAccounts);

//               // Update initialised extensions.
//               updateInitialisedExtensions(id);
//             }
//           });
//           addToUnsubscribe(id, unsub);
//           return true;
//         }
//       } catch (err) {
//         handleExtensionError(id, String(err));
//       }
//     }
//     return false;
//   };

//   const handleExtensionError = (id: string, err: string) => {
//     // if not general error (maybe enabled but no accounts trust app)
//     if (err.startsWith('Error')) {
//       // remove extension from local `active_extensions`.
//       removeFromLocalExtensions(id);

//       // extension not found (does not exist)
//       if (err.substring(0, 17) === 'NotInstalledError') {
//         setExtensionStatus(id, 'not_found');
//       } else {
//         // declare extension as no imported accounts authenticated.
//         setExtensionStatus(id, 'not_authenticated');
//       }
//     }
//     // mark extension as initialised
//     updateInitialisedExtensions(id);
//   };

//   // update initialised extensions.
//   const updateInitialisedExtensions = (id: string) => {
//     if (!extensionsInitialisedRef.current.includes(id)) {
//       setStateWithRef(
//         [...extensionsInitialisedRef.current].concat(id),
//         setExtensionsInitialised,
//         extensionsInitialisedRef
//       );
//     }
//   };

//   // Unsubscrbe all account subscriptions.
//   const unsubscribe = () => {
//     Object.values(unsubs.current).forEach((unsub) => {
//       unsub();
//     });
//   };

//   // add an extension id to unsubscribe state.
//   const addToUnsubscribe = (id: string, unsub: AnyApi) => {
//     unsubs.current[id] = unsub;
//   };

//   // re-sync extensions accounts on network switch
//   //
//   // do this if activeAccount is present. if activeAccount is present, and extensions have for some
//   // reason forgot the site, then all pop-ups will be summoned here.
//   useEffect(() => {
//     // wait for injectedWeb3 check to finish before starting
//     // account import process.
//     if (!checkingInjectedWeb3) {
//       // unsubscribe from all accounts and reset state
//       unsubscribe();
//       setStateWithRef([], setExtensionsInitialised, extensionsInitialisedRef);
//       setExtensionAccountsSynced(false);

//       // if extensions have been fetched, get accounts if extensions exist and
//       // local extensions exist (previously connected).

//       if (extensions.length) {
//         // get active extensions
//         const localExtensions = localStorageOrDefault(
//           `active_extensions`,
//           [],
//           true
//         );
//         if (extensions.length && localExtensions.length) {
//           connectActiveExtensions();
//         } else {
//           setExtensionAccountsSynced(true);
//         }
//       }
//     }
//     return () => unsubscribe();
//   }, [extensions?.length, network, checkingInjectedWeb3]);

//   // Once initialised extensions equal total extensions present in `injectedWeb3`, mark extensions
//   // as fetched.
//   useEffectIgnoreInitial(() => {
//     if (
//       (!checkingInjectedWeb3 &&
//         extensionsInitialisedRef.current.length === extensions?.length) ||
//       0
//     ) {
//       setExtensionAccountsSynced(true);
//     }
//   }, [checkingInjectedWeb3, extensionsInitialisedRef.current]);

//   // Once extensions are fully initialised, fetch accounts from other sources.
//   useEffectIgnoreInitial(() => {
//     if (extensionAccountsSynced) {
//       // Fetch accounts from supported hardware wallets.
//       importLocalAccounts(getLocalVaultAccounts);
//       importLocalAccounts(getLocalLedgerAccounts);
//       hardwareInitialisedRef.current = true;
//       // Finally, fetch any read-only accounts that have been added by `system` or `user`.
//       importLocalAccounts(getLocalExternalAccounts);
//     }
//   }, [extensionAccountsSynced]);

//   return (
//     <ExtensionAccounts.Provider
//       value={{
//         connectExtensionAccounts,
//       }}
//     >
//       {children}
//     </ExtensionAccounts.Provider>
//   );
// };

// export const ExtensionAccounts = createContext<any>(null);

// export const useExtensionAccounts = () => useContext(ExtensionAccounts);
