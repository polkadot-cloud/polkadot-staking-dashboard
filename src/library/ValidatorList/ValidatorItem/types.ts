// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@polkadot-cloud/react/types';
import type { ValidatorListEntry } from 'contexts/Validators/types';
import type { BondFor, DisplayFor } from 'types';

export interface ValidatorItemProps {
  validator: ValidatorListEntry;
  bondFor: BondFor;
  displayFor: DisplayFor;
  nominator: MaybeAddress;
  format?: string;
  showMenu?: boolean;
  toggleFavorites?: boolean;
  nominationStatus?: NominationStatus;
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

export type NominationStatus = 'active' | 'inactive' | 'waiting';
