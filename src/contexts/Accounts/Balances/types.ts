// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

export interface BondedAccount {
  address: string;
  unsub: { (): void } | null;
}

export interface Balances {
  address?: string;
  bonded?: string;
  nominations?: Nominations;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export type Targets = string[];

export interface BalancesContextInterface {
  getAccount: (address: MaybeAccount) => Balances | null;
  getBondedAccount: (address: MaybeAccount) => string | null;
  getAccountNominations: (address: MaybeAccount) => Targets;
  isController: (address: MaybeAccount) => boolean;
  balances: Balances[];
  existentialAmount: BigNumber;
}
