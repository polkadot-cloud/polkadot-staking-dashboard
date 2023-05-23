// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setStateWithRef } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import type { VaultAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { getLocalVaultAccounts } from './Utils';
import { defaultVaultrHardwareContext } from './defaults';
import type { VaultHardwareContextInterface } from './types';

export const VaultHardwareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useApi();

  const [vaultAccounts, seVaultAccountsState] = useState<VaultAccount[]>(
    getLocalVaultAccounts(network.name)
  );
  const vaultAccountsRef = useRef(vaultAccounts);

  const vaultAccountExists = (address: string) => {
    // TODO: implement
    return false;
  };

  const addVaultAccount = (address: string, index: number) => {
    // TODO: implement
    return null;
  };

  const removeVaultAccount = (address: string) => {
    // TODO: implement
  };

  const getVaultAccount = (address: string) => {
    // TODO: implement
    return null;
  };

  const renameVaultAccount = (address: string, newName: string) => {
    // TODO: implement
  };

  // Refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalVaultAccounts(network.name),
      seVaultAccountsState,
      vaultAccountsRef
    );
  }, [network]);

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
    defaultVaultrHardwareContext
  );

export const useLedgerHardware = () => React.useContext(VaultHardwareContext);
