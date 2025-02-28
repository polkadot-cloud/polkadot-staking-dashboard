// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, setStateWithRef } from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { VaultAccount } from '@w3ux/react-connect-kit/types';
import { useNetwork } from 'contexts/Network';
import { getLocalVaultAccounts, isLocalNetworkAddress } from '../Utils';
import type { VaultAccountsContextInterface } from './types';
import { defaultVaultAccountsContext } from './defaults';

export const VaultAccountsContext =
  createContext<VaultAccountsContextInterface>(defaultVaultAccountsContext);

export const useVaultAccounts = () => useContext(VaultAccountsContext);

export const VaultAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network } = useNetwork();

  const [vaultAccounts, seVaultAccountsState] = useState<VaultAccount[]>(
    getLocalVaultAccounts(network)
  );
  const vaultAccountsRef = useRef(vaultAccounts);

  // Check if a Vault address exists in imported addresses.
  const vaultAccountExists = (address: string) =>
    !!getLocalVaultAccounts().find((a) =>
      isLocalNetworkAddress(network, a, address)
    );

  // Adds a vault account to state and local storage.
  const addVaultAccount = (
    address: string,
    index: number,
    callback?: () => void
  ) => {
    let newVaultAccounts = getLocalVaultAccounts();

    if (
      !newVaultAccounts.find((a) => isLocalNetworkAddress(network, a, address))
    ) {
      const account = {
        address,
        network,
        name: ellipsisFn(address),
        source: 'vault',
        index,
      };

      newVaultAccounts = [...newVaultAccounts].concat(account);
      localStorage.setItem(
        'polkadot_vault_accounts',
        JSON.stringify(newVaultAccounts)
      );

      // store only those accounts on the current network in state.
      setStateWithRef(
        newVaultAccounts.filter((a) => a.network === network),
        seVaultAccountsState,
        vaultAccountsRef
      );

      // Handle optional callback function.
      if (typeof callback === 'function') {
        callback();
      }

      return account;
    }
    return null;
  };

  const removeVaultAccount = (address: string, callback?: () => void) => {
    let newVaultAccounts = getLocalVaultAccounts();

    newVaultAccounts = newVaultAccounts.filter((a) => {
      if (a.address !== address) {
        return true;
      }
      if (a.network !== network) {
        return true;
      }
      return false;
    });

    if (!newVaultAccounts.length) {
      localStorage.removeItem('polkadot_vault_accounts');
    } else {
      localStorage.setItem(
        'polkadot_vault_accounts',
        JSON.stringify(newVaultAccounts)
      );
    }
    setStateWithRef(
      newVaultAccounts.filter((a) => a.network === network),
      seVaultAccountsState,
      vaultAccountsRef
    );

    // Handle optional callback function.
    if (typeof callback === 'function') {
      callback();
    }
  };

  const getVaultAccount = (address: string) => {
    const localVaultAccounts = getLocalVaultAccounts();
    if (!localVaultAccounts) {
      return null;
    }
    return (
      localVaultAccounts.find((a) =>
        isLocalNetworkAddress(network, a, address)
      ) ?? null
    );
  };

  const renameVaultAccount = (address: string, newName: string) => {
    let newVaultAccounts = getLocalVaultAccounts();

    newVaultAccounts = newVaultAccounts.map((a) =>
      isLocalNetworkAddress(network, a, address)
        ? {
            ...a,
            name: newName,
          }
        : a
    );
    localStorage.setItem(
      'polkadot_vault_accounts',
      JSON.stringify(newVaultAccounts)
    );
    setStateWithRef(
      newVaultAccounts.filter((a) => a.network === network),
      seVaultAccountsState,
      vaultAccountsRef
    );
  };

  // Refresh imported vault accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalVaultAccounts(network),
      seVaultAccountsState,
      vaultAccountsRef
    );
  }, [network]);

  return (
    <VaultAccountsContext.Provider
      value={{
        vaultAccountExists,
        addVaultAccount,
        removeVaultAccount,
        renameVaultAccount,
        getVaultAccount,
        vaultAccounts: vaultAccountsRef.current,
      }}
    >
      {children}
    </VaultAccountsContext.Provider>
  );
};
