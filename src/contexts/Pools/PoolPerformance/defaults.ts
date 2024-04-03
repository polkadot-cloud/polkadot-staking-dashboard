// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { PoolPerformanceContextInterface } from './types';

export const defaultPoolPerformanceContext: PoolPerformanceContextInterface = {
  getPoolRewardPoints: () => ({}),
  getPerformanceFetchedKey: (key) => ({ status: 'unsynced', hash: '' }),
  setPerformanceFetchedKey: (key, status, hash) => {},
  updatePerformanceFetchedKey: (key, status) => {},
};
