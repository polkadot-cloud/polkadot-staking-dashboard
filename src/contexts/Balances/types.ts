// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';

export interface UnlockChunk {
  era: number;
  value: BN;
}

export interface BalanceLedger {
  address: MaybeAccount;
  stash: string | null;
  active: BN;
  total: BN;
  unlocking: Array<UnlockChunk>;
}

export interface BondedAccount {
  address: string;
  unsub: { (): void } | null;
}

export interface Lock {
  id: string;
  amount: BN;
  reasons: string;
}
export interface Balance {
  free: BN;
  reserved: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  freeAfterReserve: BN;
}

export interface BalancesAccount {
  address?: string;
  balance?: Balance;
  bonded?: string;
  ledger?: BalanceLedger;
  locks?: Array<Lock>;
  nominations?: Nominations;
}

export interface BondOptions {
  freeBalance: BN;
  freeToUnbond: BN;
  totalUnlocking: BN;
  totalUnlocked: BN;
  totalPossibleBond: BN;
  totalUnlockChuncks: number;
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
  getBondOptions: (address: MaybeAccount | null) => BondOptions;
  isController: (address: MaybeAccount) => boolean;
  accounts: Array<BalancesAccount>;
  minReserve: BN;
  existentialAmount: BN;
  reserveAmount: BN;
  ledgers: any;
}
