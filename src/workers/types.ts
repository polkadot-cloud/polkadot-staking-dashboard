// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ActiveAccountStaker,
  Exposure,
  Staker,
} from 'contexts/Staking/types';
import type { MaybeAddress, NetworkName } from 'types';

export interface ProcessExposuresArgs {
  task: string;
  networkName: NetworkName;
  era: string;
  activeAccount: MaybeAddress;
  units: number;
  exposures: Exposure[];
  maxExposurePageSize: number;
}

export interface ProcessExposuresResponse {
  task: string;
  networkName: NetworkName;
  era: string;
  stakers: Staker[];
  totalActiveNominators: number;
  activeAccountOwnStake: ActiveAccountStaker[];
  activeValidators: number;
  who: MaybeAddress;
}

export interface ProcessEraForExposureArgs {
  era: string;
  maxExposurePageSize: string;
  exposures: Exposure[];
  exitOnExposed: boolean;
  task: string;
  networkName: NetworkName;
  who: MaybeAddress;
}
