// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { Balance, Ledger } from 'contexts/Balances/types';
import type { PayeeConfig } from 'contexts/Setup/types';

export const defaultBalance: Balance = {
  free: new BigNumber(0),
  reserved: new BigNumber(0),
  frozen: new BigNumber(0),
};

export const defaultLedger: Ledger = {
  stash: null,
  active: new BigNumber(0),
  total: new BigNumber(0),
  unlocking: [],
};

export const defaultPayee: PayeeConfig = {
  destination: 'Staked',
  account: null,
};
