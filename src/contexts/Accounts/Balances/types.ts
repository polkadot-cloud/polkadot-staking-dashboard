// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

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

export interface Balances {
  address?: string;
  balance?: Balance;
  bonded?: string;
  locks?: Array<Lock>;
  nominations?: Nominations;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export type Targets = string[];

export interface BalancesContextInterface {
  getAccount: (address: MaybeAccount) => Balances | null;
  getAccountBalance: (address: MaybeAccount) => Balance;
  getAccountLocks: (address: MaybeAccount) => Array<Lock>;
  getBondedAccount: (address: MaybeAccount) => string | null;
  getAccountNominations: (address: MaybeAccount) => Targets;
  isController: (address: MaybeAccount) => boolean;
  balances: Array<Balances>;
  existentialAmount: BigNumber;
}
