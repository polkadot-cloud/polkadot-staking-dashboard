// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BondFor, MaybeAccount } from 'types';

export interface NominationProps {
  validator: any;
  nominator: MaybeAccount;
  toggleFavorites: boolean;
  batchIndex: number;
  batchKey: string;
  bondFor: BondFor;
  inModal: boolean;
}

export interface DefaultProps {
  validator: any;
  toggleFavorites: boolean;
  batchIndex: number;
  batchKey: string;
  showMenu: boolean;
  inModal: boolean;
}
