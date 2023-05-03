// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

export interface BalancesContextInterface {
  ledgers: Ledger[];
  balances: Balances[];
  getStashLedger: (a: MaybeAccount) => Ledger;
  getBalance: (address: MaybeAccount) => Balance;
  getLocks: (address: MaybeAccount) => BalanceLock[];
  getNonce: (address: MaybeAccount) => number;
}

export interface Balances {
  address?: string;
  nonce?: number;
  balance?: Balance;
  locks?: BalanceLock[];
}

export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  frozen: BigNumber | undefined;
  miscFrozen: BigNumber | undefined;
  feeFrozen: BigNumber | undefined;
  freeAfterReserve: BigNumber;
}

export interface UnlockChunkRaw {
  era: string;
  value: string;
}
export interface UnlockChunk {
  era: number;
  value: BigNumber;
}

export interface BalanceLock {
  id: string;
  amount: BigNumber;
  reasons: string;
}

export interface Ledger {
  address: MaybeAccount;
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: UnlockChunk[];
}
