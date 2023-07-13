// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ActiveAccountStaker,
  Exposure,
  Staker,
} from 'contexts/Staking/types';
import type { MaybeAccount } from 'types';

export interface DataInitialiseExposures {
  task: string;
  activeAccount: MaybeAccount;
  units: number;
  exposures: Exposure[];
}

export interface ResponseInitialiseExposures {
  task: string;
  stakers: Staker[];
  totalActiveNominators: number;
  activeAccountOwnStake: ActiveAccountStaker[];
  activeValidators: number;
  who: MaybeAccount;
}
