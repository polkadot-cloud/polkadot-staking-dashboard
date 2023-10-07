// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import Keyring from '@polkadot/keyring';
import { ellipsisFn, setStateWithRef } from '@polkadot-cloud/utils';
import React, { useEffect, useRef, useState } from 'react';
import type {
  ConnectContextInterface,
  ExternalAccount,
  ImportedAccount,
} from 'contexts/Connect/types';
import { useExtensions } from '@polkadot-cloud/react/hooks';

import type { MaybeAccount, NetworkName } from 'types';

import { useNetwork } from 'contexts/Network';
import {
  getActiveAccountLocal,
  getLocalExternalAccounts,
  removeLocalExternalAccounts,
} from './Utils';
import { defaultConnectContext } from './defaults';
import { useActiveAccounts } from './ActiveAccounts';

export const ConnectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { networkData, network } = useNetwork();
  const { checkingInjectedWeb3, extensions } = useExtensions();
  const { activeAccount, setActiveAccount } = useActiveAccounts();

  // Store other (non-extension) accounts list.
  const [otherAccounts, setOtherAccounts] = useState<ImportedAccount[]>([]);
  const otherAccountsRef = useRef(otherAccounts);

  // Store unsubscribe handlers for connected extensions.
  const unsubs = useRef<Record<string, VoidFn>>({});

  /* re-sync extensions accounts on network switch
   * do this if activeAccount is present.
   * if activeAccount is present, and extensions have for some
   * reason forgot the site, then all pop-ups will be summoned
   * here.
   */
  useEffect(() => {
    if (!checkingInjectedWeb3) {
      // unsubscribe from all accounts and reset state.
      unsubscribe();
      setStateWithRef([], setOtherAccounts, otherAccountsRef);
    }
    return () => unsubscribe();
  }, [extensions?.length, network, checkingInjectedWeb3]);

  // Unsubscrbe all account subscriptions.
  const unsubscribe = () => {
    Object.values(unsubs.current).forEach((unsub) => {
      unsub();
    });
  };

  // Unsubscrbe from some account subscriptions and update the resulting state.
  // TODO: move to ImportedAccounts context and refactor to account for all account sources.
  const forgetAccounts = (forget: ImportedAccount[]) => {
    if (!forget.length) return;

    for (const { address } of forget) {
      const unsub = unsubs.current[address];
      if (unsub) {
        unsub();
        delete unsubs.current[address];
      }
    }

    // If the currently active account is being forgotten, disconnect.
    if (forget.find((a) => a.address === activeAccount) !== undefined) {
      localStorage.removeItem(`${network}_active_account`);
      setActiveAccount(null);
    }

    // Get any external accounts and remove from localStorage.
    const externalToForget = forget.filter((i) => 'network' in i);
    if (externalToForget.length) {
      removeLocalExternalAccounts(
        network,
        externalToForget as ExternalAccount[]
      );
    }

    // Remove forgotten accounts from state.
    setStateWithRef(
      [...otherAccountsRef.current].filter(
        (a) => forget.find(({ address }) => address === a.address) === undefined
      ),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  // renames an account
  // TODO: move to ImportedAccounts context and refactor to account for all account sources.
  const renameImportedAccount = (address: MaybeAccount, newName: string) => {
    setStateWithRef(
      [...otherAccountsRef.current].map((a) =>
        a.address !== address
          ? a
          : {
              ...a,
              name: newName,
            }
      ),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  /* Checks `localStorage` for previously added accounts from the provided source, and adds them to
   * `accounts` state. if local active account is present, it will also be assigned as active.
   * Accounts are ignored if they are already imported through an extension. */
  const importLocalAccounts = (
    getter: (n: NetworkName) => ImportedAccount[]
  ) => {
    // Get accounts from provided `getter` function. The resulting array of accounts must contain an
    // `address` field.
    let localAccounts = getter(network);

    if (localAccounts.length) {
      const activeAccountInSet =
        localAccounts.find(
          ({ address }) =>
            address === getActiveAccountLocal(network, networkData.ss58)
        ) ?? null;

      // remove already-imported accounts.
      localAccounts = localAccounts.filter(
        (l) =>
          otherAccountsRef.current.find(
            ({ address }) => address === l.address
          ) === undefined
      );

      // set active account for networkData.
      if (activeAccountInSet) {
        setActiveAccount(activeAccountInSet?.address || null);
      }
      // add accounts to imported.
      addOtherAccounts(localAccounts);
    }
  };

  // adds an external account (non-wallet) to accounts
  const addExternalAccount = (address: string, addedBy: string) => {
    // ensure account is formatted correctly
    const keyring = new Keyring();
    keyring.setSS58Format(networkData.ss58);
    const formatted = keyring.addFromAddress(address).address;

    const newAccount = {
      address: formatted,
      network,
      name: ellipsisFn(address),
      source: 'external',
      addedBy,
    };

    // get all external accounts from localStorage.
    const localExternalAccounts = getLocalExternalAccounts();
    const existsLocal = localExternalAccounts.find(
      (l) => l.address === address && l.network === network
    );

    // check that address is not sitting in imported accounts (currently cannot check which
    // network).
    const existsImported = otherAccountsRef.current.find(
      (a) => a.address === address
    );

    // add external account if not there already.
    if (!existsLocal && !existsImported) {
      localStorage.setItem(
        'external_accounts',
        JSON.stringify(localExternalAccounts.concat(newAccount))
      );

      // add external account to imported accounts
      addOtherAccounts([newAccount]);
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

  // Add other accounts to context state.
  const addOtherAccounts = (a: ImportedAccount[]) => {
    setStateWithRef(
      [...otherAccountsRef.current].concat(a),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  // Replaces an account in context state.
  // TODO: move to ImportedAccounts context and refactor to account for all account sources.
  const replaceAccount = (a: ImportedAccount) => {
    setStateWithRef(
      [...otherAccountsRef.current].map((item) =>
        item.address !== a.address ? item : a
      ),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  return (
    <ConnectContext.Provider
      value={{
        addExternalAccount,
        addOtherAccounts,
        forgetAccounts,
        renameImportedAccount,
        importLocalAccounts,
        otherAccounts: otherAccountsRef.current,
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
