// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  LedgerAccountsContextInterface,
  LedgerHardwareContextInterface,
} from './types';

export const TotalAllowedStatusCodes = 50;

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
  getFeedback: () => defaultFeedback,
  setFeedback: (s, h) => {},
  resetFeedback: () => {},
  handleUnmount: () => {},
  handleErrors: (appName, err) => {},
  handleGetAddress: (appName, accountIndex) =>
    new Promise((resolve) => resolve()),
  handleSignTx: (appName, uid, index, payload) =>
    new Promise((resolve) => resolve()),
  handleResetLedgerTx: () => {},
  runtimesInconsistent: false,
};

export const defaultLedgerAccountsContext: LedgerAccountsContextInterface = {
  ledgerAccountExists: (a) => false,
  addLedgerAccount: (a, i) => null,
  removeLedgerAccount: (a) => {},
  renameLedgerAccount: (a, n) => {},
  getLedgerAccount: (a) => null,
  ledgerAccounts: [],
};
