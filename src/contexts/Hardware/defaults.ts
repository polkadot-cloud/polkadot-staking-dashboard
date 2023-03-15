// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerHardwareContextInterface } from './types';

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportError: null,
  transportResponse: null,
  ledgerDeviceInfo: null,
  executeLedgerLoop: async () => new Promise((resolve) => resolve()),
  // eslint-disable-next-line
  setIsPaired: (v) => {},
  // eslint-disable-next-line
  handleNewStatusCode: (a, s) => {},
  // eslint-disable-next-line
  setIsImporting: (b) => {},
  cancelImport: () => {},
  checkPaired: async () => new Promise((resolve) => resolve(false)),
  resetStatusCodes: () => {},
  getIsImporting: () => false,
  statusCodes: [],
  isPaired: 'unknown',
};
