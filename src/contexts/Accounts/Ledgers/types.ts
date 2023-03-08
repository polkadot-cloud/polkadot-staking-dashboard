// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { AnyApi, MaybeAccount } from 'types';

export interface UnlockChunk {
  era: number;
  value: BigNumber;
}

export interface Ledger {
  address: MaybeAccount;
  stash: string | null;
  active: BigNumber;
  total: BigNumber;
  unlocking: Array<UnlockChunk>;
}

export interface LedgersContextInterface {
  getLedgerForStash: (address: MaybeAccount) => Ledger;
  getLedgerForController: (address: MaybeAccount) => Ledger | null;
  ledgers: AnyApi;
}
