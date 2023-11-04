// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  LedgerHardwareContextInterface,
  VaultHardwareContextInterface,
} from './types';

export const TOTAL_ALLOWED_STATUS_CODES = 50;
export const LEDGER_DEFAULT_ACCOUNT = 0x80000000;
export const LEDGER_DEFAULT_CHANGE = 0x80000000;
export const LEDGER_DEFAULT_INDEX = 0x80000000;

export const defaultFeedback = {
  message: null,
  helpKey: null,
};

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  integrityChecked: false,
  setIntegrityChecked: (checked) => {},
  checkRuntimeVersion: async (appName) => new Promise((resolve) => resolve()),
  handleNewStatusCode: (a, s) => {},
  setIsExecuting: (b) => {},
  resetStatusCodes: () => {},
  getIsExecuting: () => false,
  getStatusCodes: () => [],
  getTransport: () => null,
  ledgerAccountExists: (a) => false,
  addLedgerAccount: (a, i) => null,
  removeLedgerAccount: (a) => {},
  renameLedgerAccount: (a, n) => {},
  getLedgerAccount: (a) => null,
  ledgerAccounts: [],
  getFeedback: () => defaultFeedback,
  setFeedback: (s, h) => {},
  resetFeedback: () => {},
  handleUnmount: () => {},
  handleErrors: (appName, err) => {},
  runtimesInconsistent: false,
  handleGetAddress: (appName, accountIndex) =>
    new Promise((resolve) => resolve()),
  handleSignTx: (appName, uid, index, payload) =>
    new Promise((resolve) => resolve()),
};

export const defaultVaultHardwareContext: VaultHardwareContextInterface = {
  vaultAccountExists: (a) => false,
  addVaultAccount: (a, i) => null,
  removeVaultAccount: (a) => {},
  renameVaultAccount: (a, n) => {},
  getVaultAccount: (a) => null,
  vaultAccounts: [],
};
