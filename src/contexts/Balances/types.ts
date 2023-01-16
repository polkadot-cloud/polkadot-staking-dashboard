// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { AnyApi, MaybeAccount } from 'types';

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
  total: BN;
}

export interface BalancesAccount {
  address?: string;
  balance?: Balance;
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
  accounts: Array<BalancesAccount>;
  existentialAmount: BN;
  ledgers: AnyApi;
}
