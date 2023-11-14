// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { VaultAccountsContextInterface } from './types';

export const defaultVaultAccountsContext: VaultAccountsContextInterface = {
  vaultAccountExists: (a) => false,
  addVaultAccount: (a, i) => null,
  removeVaultAccount: (a) => {},
  renameVaultAccount: (a, n) => {},
  getVaultAccount: (a) => null,
  vaultAccounts: [],
};
