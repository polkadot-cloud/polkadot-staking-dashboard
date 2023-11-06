// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { VaultHardwareContextInterface } from './types';

export const defaultVaultHardwareContext: VaultHardwareContextInterface = {
  vaultAccountExists: (a) => false,
  addVaultAccount: (a, i) => null,
  removeVaultAccount: (a) => {},
  renameVaultAccount: (a, n) => {},
  getVaultAccount: (a) => null,
  vaultAccounts: [],
};
