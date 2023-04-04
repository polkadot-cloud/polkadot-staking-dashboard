// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerHardwareContextInterface } from './types';

export const TOTAL_ALLOWED_STATUS_CODES = 50;
export const LEDGER_DEFAULT_ACCOUNT = 0x80000000;
export const LEDGER_DEFAULT_CHANGE = 0x80000000;
export const LEDGER_DEFAULT_INDEX = 0x80000000;

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  pairDevice: async () => new Promise((resolve) => resolve(false)),
  // eslint-disable-next-line
  executeLedgerLoop: async (a, s, o) => new Promise((resolve) => resolve()),
  // eslint-disable-next-line
  setIsPaired: (v) => {},
  // eslint-disable-next-line
  handleNewStatusCode: (a, s) => {},
  // eslint-disable-next-line
  setIsExecuting: (b) => {},
  resetStatusCodes: () => {},
  getIsExecuting: () => false,
  getStatusCodes: () => [],
  getTransport: () => null,
  // eslint-disable-next-line
  ledgerAccountExists: (a) => false,
  // eslint-disable-next-line
  addLedgerAccount: (a, i) => null,
  // eslint-disable-next-line
  removeLedgerAccount: (a) => {},
  // eslint-disable-next-line
  renameLedgerAccount: (a, n) => {},
  // eslint-disable-next-line
  getLedgerAccount: (a) => null,
  isPaired: 'unknown',
  ledgerAccounts: [],
  getDefaultMessage: () => [null, null],
  // eslint-disable-next-line
  setDefaultMessage: (s, h) => {},
  handleUnmount: () => {},
};
