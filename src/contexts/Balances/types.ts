// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export interface BalancesContextInterface {
  ledgers: Ledger[];
  balances: Balances[];
  getStashLedger: (a: MaybeAddress) => Ledger;
  getBalance: (address: MaybeAddress) => Balance;
  getLocks: (address: MaybeAddress) => BalanceLock[];
  getNonce: (address: MaybeAddress) => number;
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
  frozen: BigNumber;
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
  address: MaybeAddress;
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: UnlockChunk[];
}
