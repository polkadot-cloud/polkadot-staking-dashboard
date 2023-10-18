// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@polkadot-cloud/react/types';
import type { Validator } from 'contexts/Validators/types';
import type { BondFor, DisplayFor } from 'types';

export interface ValidatorItemProps {
  validator: Validator;
  bondFor: BondFor;
  displayFor: DisplayFor;
  nominator: MaybeAddress;
  format?: string;
  showMenu?: boolean;
  toggleFavorites?: boolean;
}

export interface PulseProps {
  address: string;
  displayFor: DisplayFor;
}
export interface PulseGraphProps {
  points: number[];
  syncing: boolean;
  displayFor: DisplayFor;
}
