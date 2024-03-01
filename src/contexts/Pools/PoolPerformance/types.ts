// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, Sync } from 'types';

export interface PoolPerformanceContextInterface {
  poolRewardPointsFetched: Sync;
  poolRewardPoints: AnyJson;
}
