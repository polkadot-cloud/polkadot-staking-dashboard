// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerAccount, VaultAccount } from '@polkadot-cloud/react/types';

export interface VaultAccountsContextInterface {
  vaultAccountExists: (address: string) => boolean;
  addVaultAccount: (
    address: string,
    index: number,
    callback?: () => void
  ) => LedgerAccount | null;
  removeVaultAccount: (address: string, callback?: () => void) => void;
  renameVaultAccount: (address: string, newName: string) => void;
  getVaultAccount: (address: string) => LedgerAccount | null;
  vaultAccounts: VaultAccount[];
}
