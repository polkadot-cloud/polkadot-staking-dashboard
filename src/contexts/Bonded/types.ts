// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAccount } from 'types';

export interface BondedAccount {
  address?: string;
  bonded?: string;
  nominations?: Nominations;
}

export interface Nominations {
  targets: Targets;
  submittedIn: string | number;
}

export type Targets = string[];

export interface BondedContextInterface {
  getAccount: (address: MaybeAccount) => BondedAccount | null;
  getBondedAccount: (address: MaybeAccount) => string | null;
  getAccountNominations: (address: MaybeAccount) => Targets;
  isController: (address: MaybeAccount) => boolean;
  bondedAccounts: BondedAccount[];
}
