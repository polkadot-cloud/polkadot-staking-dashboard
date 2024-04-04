// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { Sync } from 'types';

export interface PoolPerformanceContextInterface {
  getPoolRewardPoints: (key: PoolRewardPointsKey) => PoolRewardPoints;
  getPoolPerformanceTask: (
    key: PoolRewardPointsKey
  ) => PoolPerformanceTaskStatus;
  setNewPoolPerformanceTask: (
    key: PoolRewardPointsKey,
    status: Sync,
    addresses: string[],
    currentEra: BigNumber,
    endEra: BigNumber
  ) => void;
  updatePoolPerformanceTask: (key: PoolRewardPointsKey, status: Sync) => void;
  startPoolRewardPointsFetch: (
    key: PoolRewardPointsKey,
    addresses: string[]
  ) => void;
}

// Fetching status for keys.
export type PoolPerformanceTasks = Partial<
  Record<PoolRewardPointsKey, PoolPerformanceTaskStatus>
>;

// Performance fetching status.
export interface PoolPerformanceTaskStatus {
  status: Sync;
  addresses: string[];
  currentEra: BigNumber;
  endEra: BigNumber;
}

/*
 * Batch Key -> Pool Address -> Era -> Points.
 */

// Supported reward points batch keys.
export type PoolRewardPointsKey = 'pool_join' | 'pool_page';

// Pool reward batches, keyed by batch key.
export type PoolRewardPointsMap = Partial<Record<string, PoolRewardPoints>>;

// Pool reward points are keyed by era, then by pool address.

export type PoolRewardPoints = Record<PoolAddress, PointsByEra>;

export type PointsByEra = Record<EraKey, EraPoints>;

// Type aliases to better understand pool reward records.

export type PoolAddress = string;

export type EraKey = number;

export type EraPoints = string;
