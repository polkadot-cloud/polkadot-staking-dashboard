// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import {
  BalanceLedger,
  Balance,
  TransferOptions,
  Nominations,
  BalancesContextInterface,
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

export const transferOptions: TransferOptions = {
  freeBalance: new BN(0),
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

export const defaultBalancesContext: BalancesContextInterface = {
  // eslint-disable-next-line
  getAccount: (address) => null,
  // eslint-disable-next-line
  getAccountBalance: (address) => balance,
  // eslint-disable-next-line
  getLedgerForStash: (address) => ledger,
  // eslint-disable-next-line
  getLedgerForController: (address) => null,
  // eslint-disable-next-line
  getAccountLocks: (address) => [],
  // eslint-disable-next-line
  getBondedAccount: (address) => null,
  // eslint-disable-next-line
  getAccountNominations: (address) => [],
  // eslint-disable-next-line
  getTransferOptions: (address) => transferOptions,
  // eslint-disable-next-line
  isController: (address) => false,
  accounts: [],
  existentialAmount: new BN(0),
  ledgers: [],
};
