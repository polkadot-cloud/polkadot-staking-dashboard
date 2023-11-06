// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useNetwork } from 'contexts/Network';
import { ellipsisFn, setStateWithRef } from '@polkadot-cloud/utils';
import type { LedgerAccount } from '@polkadot-cloud/react/types';
import { useNotifications } from 'contexts/Notifications';
import { useTranslation } from 'react-i18next';
import type { LedgerAccountsContextInterface } from './types';
import { defaultLedgerAccountsContext } from './defaults';
import {
  getLocalLedgerAccounts,
  getLocalLedgerAddresses,
  isLocalNetworkAddress,
  renameLocalLedgerAddress,
} from '../Utils';

export const LedgerAccountsContext =
  React.createContext<LedgerAccountsContextInterface>(
    defaultLedgerAccountsContext
  );

export const LedgerAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { addNotification } = useNotifications();

  // Store the fetched ledger accounts.
  const [ledgerAccounts, setLedgerAccountsState] = useState<LedgerAccount[]>(
    getLocalLedgerAccounts(network)
  );
  const ledgerAccountsRef = useRef(ledgerAccounts);

  // Check if a Ledger address exists in imported addresses.
  const ledgerAccountExists = (address: string) =>
    !!getLocalLedgerAccounts().find((a) =>
      isLocalNetworkAddress(network, a, address)
    );

  // Adds a ledger address to the list of fetched addresses.
  const addLedgerAccount = (address: string, index: number) => {
    let newLedgerAccounts = getLocalLedgerAccounts();

    const ledgerAddress = getLocalLedgerAddresses().find((a) =>
      isLocalNetworkAddress(network, a, address)
    );

    if (
      ledgerAddress &&
      !newLedgerAccounts.find((a) => isLocalNetworkAddress(network, a, address))
    ) {
      const account = {
        address,
        network,
        name: ledgerAddress.name,
        source: 'ledger',
        index,
      };

      // update the full list of local ledger accounts with new entry.
      newLedgerAccounts = [...newLedgerAccounts].concat(account);
      localStorage.setItem(
        'ledger_accounts',
        JSON.stringify(newLedgerAccounts)
      );

      // store only those accounts on the current network in state.
      setStateWithRef(
        newLedgerAccounts.filter((a) => a.network === network),
        setLedgerAccountsState,
        ledgerAccountsRef
      );

      addNotification({
        title: t('ledgerAccountImported'),
        subtitle: t('ledgerImportedAccount', { account: ellipsisFn(address) }),
      });

      return account;
    }
    return null;
  };

  // Removes a Ledger account from state and local storage.
  const removeLedgerAccount = (address: string, notify: boolean = true) => {
    const newLedgerAccounts = getLocalLedgerAccounts().filter((a) => {
      if (a.address !== address) return true;
      if (a.network !== network) return true;
      return false;
    });

    if (!newLedgerAccounts.length) localStorage.removeItem('ledger_accounts');
    else
      localStorage.setItem(
        'ledger_accounts',
        JSON.stringify(newLedgerAccounts)
      );

    setStateWithRef(
      newLedgerAccounts.filter((a) => a.network === network),
      setLedgerAccountsState,
      ledgerAccountsRef
    );

    if (notify) {
      addNotification({
        title: t('ledgerAccountRemoved'),
        subtitle: t('ledgerRemovedAccount', { account: ellipsisFn(address) }),
      });
    }
  };

  // Renames an imported ledger account.
  const renameLedgerAccount = (address: string, newName: string) => {
    let newLedgerAccounts = getLocalLedgerAccounts();

    newLedgerAccounts = newLedgerAccounts.map((a) =>
      isLocalNetworkAddress(network, a, address)
        ? {
            ...a,
            name: newName,
          }
        : a
    );
    renameLocalLedgerAddress(address, newName, network);
    localStorage.setItem('ledger_accounts', JSON.stringify(newLedgerAccounts));
    setStateWithRef(
      newLedgerAccounts.filter((a) => a.network === network),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  };

  // Gets an imported address along with its Ledger metadata.
  const getLedgerAccount = (address: string) => {
    const localLedgerAccounts = getLocalLedgerAccounts();
    if (!localLedgerAccounts) return null;
    return (
      localLedgerAccounts.find((a) =>
        isLocalNetworkAddress(network, a, address)
      ) ?? null
    );
  };

  // Refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAccounts(network),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  }, [network]);

  return (
    <LedgerAccountsContext.Provider
      value={{
        ledgerAccountExists,
        getLedgerAccount,
        addLedgerAccount,
        removeLedgerAccount,
        renameLedgerAccount,
        ledgerAccounts: ledgerAccountsRef.current,
      }}
    >
      {children}
    </LedgerAccountsContext.Provider>
  );
};

export const useLedgerAccounts = () => React.useContext(LedgerAccountsContext);
