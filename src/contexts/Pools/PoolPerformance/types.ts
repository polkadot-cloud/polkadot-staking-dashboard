// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-cloud/react/types';
import type { Sync } from 'types';

export interface PoolPerformanceContextInterface {
  poolRewardPointsFetched: Sync;
  poolRewardPoints: AnyJson;
}
