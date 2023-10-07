// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';

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
  getAccount: (address: MaybeAddress) => BondedAccount | null;
  getBondedAccount: (address: MaybeAddress) => string | null;
  getAccountNominations: (address: MaybeAddress) => Targets;
  isController: (address: MaybeAddress) => boolean;
  bondedAccounts: BondedAccount[];
}
