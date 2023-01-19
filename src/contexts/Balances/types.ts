// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { AnyApi, MaybeAccount } from 'types';

export interface UnlockChunk {
  era: number;
  value: BigNumber;
}

export interface BalanceLedger {
  address: MaybeAccount;
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: Array<UnlockChunk>;
}

export interface BondedAccount {
  address: string;
  unsub: { (): void } | null;
}

export interface Lock {
  id: string;
  amount: BigNumber;
  reasons: string;
}
export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  miscFrozen: BigNumber;
  feeFrozen: BigNumber;
  freeAfterReserve: BigNumber;
}

export interface BalancesAccount {
  address?: string;
  balance?: Balance;
  bonded?: string;
  ledger?: BalanceLedger;
  locks?: Array<Lock>;
  nominations?: Nominations;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export type Targets = string[];

export interface BalancesContextInterface {
  getAccount: (address: MaybeAccount) => BalancesAccount | null;
  getAccountBalance: (address: MaybeAccount) => Balance;
  getLedgerForStash: (address: MaybeAccount) => BalanceLedger;
  getLedgerForController: (address: MaybeAccount) => BalanceLedger | null;
  getAccountLocks: (address: MaybeAccount) => Array<Lock>;
  getBondedAccount: (address: MaybeAccount) => string | null;
  getAccountNominations: (address: MaybeAccount) => Targets;
  isController: (address: MaybeAccount) => boolean;
  accounts: Array<BalancesAccount>;
  existentialAmount: BigNumber;
  ledgers: AnyApi;
}
