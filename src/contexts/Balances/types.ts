// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { ActiveBalancesState } from 'contexts/ActiveAccounts/types';
import type { MaybeAddress } from 'types';

export interface BalancesContextInterface {
  activeBalances: ActiveBalancesState;
  getNonce: (address: MaybeAddress) => number;
  getActiveBalanceLocks: (address: MaybeAddress) => BalanceLock[];
  getActiveBalance: (address: MaybeAddress) => Balance;
  getActiveStashLedger: (address: MaybeAddress) => Ledger;
  balancesSynced: boolean;
}

// NOTE: new balance type for combined ledger and balances
export interface ActiveBalance {
  ledger: Ledger;
  balances: Balances;
}

export interface Balances {
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
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: UnlockChunk[];
}
