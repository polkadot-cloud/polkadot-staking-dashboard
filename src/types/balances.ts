// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export interface UnlockChunk {
  era: number;
  value: BN;
}

export interface BalanceLedger {
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
  freeToBond: BN;
  freeToUnbond: BN;
  totalUnlocking: BN;
  totalUnlocked: BN;
  totalPossibleBond: BN;
  freeToStake: BN;
  totalUnlockChuncks: number;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export type Targets = Array<string>;

export interface BalancesContextInterface {
  getAccount: (address: string) => BalancesAccount | null;
  getAccountBalance: (address: string) => Balance;
  getAccountLedger: (address: string) => BalanceLedger;
  getAccountLocks: (address: string) => Array<Lock>;
  getBondedAccount: (address: string) => string | null;
  getAccountNominations: (address: string) => Targets;
  getBondOptions: (address: string) => BondOptions;
  isController: (address: string) => boolean;
  accounts: Array<BalancesAccount>;
  minReserve: BN;
  ledgersSyncingCount: number;
}
