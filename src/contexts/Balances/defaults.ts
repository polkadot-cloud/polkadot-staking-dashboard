// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import {
  Balance,
  BalanceLedger,
  BalancesContextInterface,
  Nominations,
} from 'contexts/Balances/types';

export const balance: Balance = {
  free: new BN(0),
  reserved: new BN(0),
  miscFrozen: new BN(0),
  feeFrozen: new BN(0),
  freeAfterReserve: new BN(0),
};

export const ledger: BalanceLedger = {
  address: null,
  stash: null,
  active: new BN(0),
  total: new BN(0),
  unlocking: [],
};

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBalancesContext: BalancesContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccount: (address) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccountBalance: (address) => balance,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLedgerForStash: (address) => ledger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLedgerForController: (address) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccountLocks: (address) => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBondedAccount: (address) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccountNominations: (address) => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isController: (address) => false,
  accounts: [],
  existentialAmount: new BN(0),
  ledgers: [],
};
