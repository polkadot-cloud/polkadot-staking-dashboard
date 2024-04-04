// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type {
  PoolPerformanceContextInterface,
  PoolPerformanceTaskStatus,
} from './types';

export const defaultPoolPerformanceTask: PoolPerformanceTaskStatus = {
  status: 'unsynced',
  addresses: [],
  currentEra: BigNumber(0),
  endEra: BigNumber(0),
};
export const defaultPoolPerformanceContext: PoolPerformanceContextInterface = {
  getPoolRewardPoints: () => ({}),
  getPoolPerformanceTask: (key) => defaultPoolPerformanceTask,
  setNewPoolPerformanceTask: (key, status, addresses) => {},
  updatePoolPerformanceTask: (key, status) => {},
  startPoolRewardPointsFetch: (key, addresses) => {},
};
