// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type { AccountBalancesContextInterface, Ledger } from './types';

export const defaultAccountBalancesContext: AccountBalancesContextInterface = {
  // eslint-disable-next-line
  getLedgerForStash: (address) => ledger,
  // eslint-disable-next-line
  getLedgerForController: (address) => null,
  ledgers: [],
};

export const ledger: Ledger = {
  address: null,
  stash: null,
  active: new BigNumber(0),
  total: new BigNumber(0),
  unlocking: [],
};
