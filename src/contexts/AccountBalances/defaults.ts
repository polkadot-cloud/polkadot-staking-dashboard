// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type { AccountBalancesContextInterface, Balance, Ledger } from './types';

export const defaultAccountBalancesContext: AccountBalancesContextInterface = {
  ledgers: [],
  // eslint-disable-next-line
  getStashLedger: (address) => defaultLedger,
  // eslint-disable-next-line
  getBalance: (address) => defaultBalance,
  // eslint-disable-next-line
  getLocks: (address) => [],
  // eslint-disable-next-line
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
  miscFrozen: new BigNumber(0),
  feeFrozen: new BigNumber(0),
  freeAfterReserve: new BigNumber(0),
};
