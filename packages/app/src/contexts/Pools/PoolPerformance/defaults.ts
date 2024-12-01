// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { PoolPerformanceTaskStatus } from 'types';
import type { PoolPerformanceContextInterface } from './types';

export const defaultPoolPerformanceTask: PoolPerformanceTaskStatus = {
  status: 'unsynced',
  addresses: [],
  startEra: BigNumber(0),
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
