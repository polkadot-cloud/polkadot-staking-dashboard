// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';
import {
  BalanceLedger,
  Balance,
  BondOptions,
  Nominations,
} from 'types/balances';

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

export const bondOptions: BondOptions = {
  freeToBond: new BN(0),
  freeToUnbond: new BN(0),
  totalUnlocking: new BN(0),
  totalUnlocked: new BN(0),
  totalPossibleBond: new BN(0),
  totalUnlockChuncks: 0,
};

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBalancesContext = {
  // eslint-disable-next-line
  getAccount: (address: MaybeAccount) => null,
  // eslint-disable-next-line
  getAccountBalance: (address: MaybeAccount) => balance,
  // eslint-disable-next-line
  getLedgerForStash: (address: MaybeAccount) => ledger,
  // eslint-disable-next-line
  getLedgerForController: (address: MaybeAccount) => null,
  // eslint-disable-next-line
  getAccountLocks: (address: MaybeAccount) => [],
  // eslint-disable-next-line
  getBondedAccount: (address: MaybeAccount) => null,
  // eslint-disable-next-line
  getAccountNominations: (address: MaybeAccount) => [],
  // eslint-disable-next-line
  getBondOptions: (address: MaybeAccount | null) => bondOptions,
  // eslint-disable-next-line
  isController: (address: MaybeAccount) => false,
  accounts: [],
  minReserve: new BN(0),
  ledgers: [],
};
