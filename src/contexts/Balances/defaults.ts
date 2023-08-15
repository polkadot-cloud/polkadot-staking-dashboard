// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { Balance, BalancesContextInterface, Ledger } from './types';

export const defaultBalancesContext: BalancesContextInterface = {
  ledgers: [],
  balances: [],
  getStashLedger: (address) => defaultLedger,
  getBalance: (address) => defaultBalance,
  getLocks: (address) => [],
  getNonce: (address) => 0,
};

export const defaultLedger: Ledger = {
  address: null,
  stash: null,
  active: new BigNumber(0),
  total: new BigNumber(0),
  unlocking: [],
};

export const defaultBalance: Balance = {
  free: new BigNumber(0),
  reserved: new BigNumber(0),
  frozen: new BigNumber(0),
};
