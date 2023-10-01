// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, setStateWithRef } from '@polkadot-cloud/utils';
import React, { useEffect, useRef, useState } from 'react';
import type { VaultAccount } from 'contexts/Connect/types';
import { useNetwork } from 'contexts/Network';
import { getLocalVaultAccounts, isLocalNetworkAddress } from './Utils';
import { defaultVaultHardwareContext } from './defaults';
import type { VaultHardwareContextInterface } from './types';

export const VaultHardwareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { networkData } = useNetwork();

  const [vaultAccounts, seVaultAccountsState] = useState<VaultAccount[]>(
    getLocalVaultAccounts(networkData.name)
  );
  const vaultAccountsRef = useRef(vaultAccounts);

  // Check if a Vault address exists in imported addresses.
  const vaultAccountExists = (address: string) =>
    !!getLocalVaultAccounts().find((a) =>
      isLocalNetworkAddress(networkData.name, a, address)
    );

  // Adds a vault account to state and local storage.
  const addVaultAccount = (address: string, index: number) => {
    let newVaultAccounts = getLocalVaultAccounts();

    if (
      !newVaultAccounts.find((a) =>
        isLocalNetworkAddress(networkData.name, a, address)
      )
    ) {
      const account = {
        address,
        network: networkData.name,
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
        newVaultAccounts.filter((a) => a.network === networkData.name),
        seVaultAccountsState,
        vaultAccountsRef
      );
      return account;
    }
    return null;
  };

  const removeVaultAccount = (address: string) => {
    let newVaultAccounts = getLocalVaultAccounts();

    newVaultAccounts = newVaultAccounts.filter((a) => {
      if (a.address !== address) {
        return true;
      }
      if (a.network !== networkData.name) {
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
      newVaultAccounts.filter((a) => a.network === networkData.name),
      seVaultAccountsState,
      vaultAccountsRef
    );
  };

  const getVaultAccount = (address: string) => {
    const localVaultAccounts = getLocalVaultAccounts();
    if (!localVaultAccounts) {
      return null;
    }
    return (
      localVaultAccounts.find((a) =>
        isLocalNetworkAddress(networkData.name, a, address)
      ) ?? null
    );
  };

  const renameVaultAccount = (address: string, newName: string) => {
    let newVaultAccounts = getLocalVaultAccounts();

    newVaultAccounts = newVaultAccounts.map((a) =>
      isLocalNetworkAddress(networkData.name, a, address)
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
      newVaultAccounts.filter((a) => a.network === networkData.name),
      seVaultAccountsState,
      vaultAccountsRef
    );
  };

  // Refresh imported vault accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalVaultAccounts(networkData.name),
      seVaultAccountsState,
      vaultAccountsRef
    );
  }, [networkData]);

  return (
    <VaultHardwareContext.Provider
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
    </VaultHardwareContext.Provider>
  );
};

export const VaultHardwareContext =
  React.createContext<VaultHardwareContextInterface>(
    defaultVaultHardwareContext
  );

export const useVaultHardware = () => React.useContext(VaultHardwareContext);
