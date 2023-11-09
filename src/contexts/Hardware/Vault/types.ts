// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VaultAccount } from '@polkadot-cloud/react/types';

export type VaultHardwareContextInterface = {
  vaultAccountExists: (a: string) => boolean;
  addVaultAccount: (a: string, i: number) => VaultAccount | null;
  removeVaultAccount: (a: string) => void;
  renameVaultAccount: (a: string, name: string) => void;
  getVaultAccount: (a: string) => VaultAccount | null;
  vaultAccounts: VaultAccount[];
};
