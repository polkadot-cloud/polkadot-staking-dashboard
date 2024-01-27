// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { PayeeConfig } from 'contexts/Setup/types';
import type { MaybeAddress } from 'types';

export interface BalancesContextInterface {
  activeBalances: ActiveBalancesState;
  getNonce: (address: MaybeAddress) => number;
  getLocks: (address: MaybeAddress) => BalanceLocks;
  getBalance: (address: MaybeAddress) => Balance;
  getLedger: (source: ActiveLedgerSource) => Ledger;
  getPayee: (address: MaybeAddress) => PayeeConfig;
  balancesInitialSynced: boolean;
}

export type ActiveBalancesState = Record<string, ActiveBalance>;

export interface ActiveBalance {
  ledger: Ledger;
  balances: Balances;
  payee: PayeeConfig;
}

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
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: UnlockChunk[];
}

export type ActiveLedgerSource = {
  [key in 'stash' | 'key']?: MaybeAddress;
};
