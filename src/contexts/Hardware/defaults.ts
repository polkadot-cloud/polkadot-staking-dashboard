// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerHardwareContextInterface } from './types';

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportError: null,
  transportResponse: null,
  ledgerDeviceInfo: null,
  executeLedgerLoop: async () => new Promise((resolve) => resolve()),
};
