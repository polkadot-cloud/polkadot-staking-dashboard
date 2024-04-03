// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolPerformanceContextInterface } from './types';

export const defaultPoolPerformanceContext: PoolPerformanceContextInterface = {
  poolRewardPointsFetched: 'unsynced',
  getPoolRewardPoints: () => ({}),
};
