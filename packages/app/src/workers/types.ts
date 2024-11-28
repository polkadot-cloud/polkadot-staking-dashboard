// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ActiveAccountStaker,
  Exposure,
  Staker,
} from 'contexts/Staking/types';
import type { MaybeAddress, NetworkId } from 'types';

export interface ProcessExposuresArgs {
  task: string;
  networkName: NetworkId;
  era: string;
  activeAccount: MaybeAddress;
  units: number;
  exposures: Exposure[];
}

export interface ProcessExposuresResponse {
  task: string;
  networkName: NetworkId;
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
  networkName: NetworkId;
  who: MaybeAddress;
}
