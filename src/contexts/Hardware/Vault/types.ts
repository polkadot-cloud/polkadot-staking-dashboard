// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerAccount, VaultAccount } from '@polkadot-cloud/react/types';

export type VaultAccountsContextInterface = {
  vaultAccountExists: (a: string) => boolean;
  addVaultAccount: (a: string, i: number) => LedgerAccount | null;
  removeVaultAccount: (a: string) => void;
  renameVaultAccount: (a: string, name: string) => void;
  getVaultAccount: (a: string) => LedgerAccount | null;
  vaultAccounts: VaultAccount[];
};
