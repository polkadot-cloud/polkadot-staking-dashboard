// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondFor, DisplayFor, MaybeAddress } from 'types';

export interface NominationProps {
  validator: any;
  nominator: MaybeAddress;
  toggleFavorites: boolean;
  bondFor: BondFor;
  displayFor: DisplayFor;
}

export interface DefaultProps {
  validator: any;
  toggleFavorites: boolean;
  showMenu: boolean;
  displayFor: DisplayFor;
}
