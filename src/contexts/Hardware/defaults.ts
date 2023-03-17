// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerHardwareContextInterface } from './types';

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  pairDevice: async () => new Promise((resolve) => resolve(false)),
  // eslint-disable-next-line
  executeLedgerLoop: async (t, s, o) => new Promise((resolve) => resolve()),
  // eslint-disable-next-line
  setIsPaired: (v) => {},
  // eslint-disable-next-line
  handleNewStatusCode: (a, s) => {},
  // eslint-disable-next-line
  setIsImporting: (b) => {},
  cancelImport: () => {},
  resetStatusCodes: () => {},
  getIsImporting: () => false,
  getStatusCodes: () => [],
  isPaired: 'unknown',
  // eslint-disable-next-line
  handleErrors: (e) => {},
  getTransport: () => null,
  // eslint-disable-next-line
  ledgerAccountExists: (a) => false,
  // eslint-disable-next-line
  addLedgerAccount: (a) => null,
  // eslint-disable-next-line
  removeLedgerAccount: (a) => {},
  // eslint-disable-next-line
  renameLedgerAccount: (a, n) => {},
  // eslint-disable-next-line
  getLedgerAccount: (a) => null,
  ledgerAccounts: [],
  // eslint-disable-next-line
  signLedgerTx: async (f, t) => new Promise((resolve) => resolve()),
};
