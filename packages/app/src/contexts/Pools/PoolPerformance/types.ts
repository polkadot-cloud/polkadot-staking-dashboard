// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from '@w3ux/types';
import type BigNumber from 'bignumber.js';

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
export type PoolPerformanceTasks = Record<
  PoolRewardPointsKey,
  PoolPerformanceTaskStatus
>;

// Performance fetching status.
export interface PoolPerformanceTaskStatus {
  status: Sync;
  addresses: string[];
  startEra: BigNumber;
  currentEra: BigNumber;
  endEra: BigNumber;
}

/*
 * Batch Key -> Pool Address -> Era -> Points.
 */

// Supported reward points batch keys.
export type PoolRewardPointsKey = string;

// Pool reward batches, keyed by batch key.
export type PoolRewardPointsMap = Record<PoolRewardPointsKey, PoolRewardPoints>;

// Pool reward points are keyed by era, then by pool address.

export type PoolRewardPoints = Record<PoolAddress, PointsByEra>;

export type PointsByEra = Record<EraKey, EraPoints>;

// Type aliases to better understand pool reward records.

export type PoolAddress = string;

export type EraKey = number;

export type EraPoints = string;
