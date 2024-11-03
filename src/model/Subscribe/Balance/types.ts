// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';

export interface Balances {
  nonce?: number;
  balance?: Balance;
  locks?: BalanceLock[];
}

export interface BalanceLocks {
  locks: BalanceLock[];
  maxLock: BigNumber;
}

export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  frozen: BigNumber;
}

export interface BalanceLock {
  id: string;
  amount: BigNumber;
  reasons: string;
}

export interface Ledger {
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: UnlockChunk[];
}

export interface UnlockChunk {
  era: number;
  value: BigNumber;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export interface UnlockChunkRaw {
  era: string;
  value: string;
}

export type Targets = string[];
