// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerHardwareContextInterface } from './types';

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  pairDevice: async () => new Promise((resolve) => resolve()),
  ledgerDeviceInfo: null,
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
  transport: null,
};
