// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from 'types';

export interface PoolPerformanceContextInterface {
  poolRewardPointsFetched: Sync;
  getPoolRewardPoints: (key: PoolRewardPointsBatchKey) => PoolRewardPoints;
  getPerformanceFetchedKey: (key: PoolRewardPointsBatchKey) => boolean;
  setPerformanceFetchedKey: (
    key: PoolRewardPointsBatchKey,
    fetched: boolean
  ) => void;
}

// Fetching status for keys.
export type PoolPerformanceFetched = Partial<
  Record<PoolRewardPointsBatchKey, boolean>
>;

/*
 * Batch Key -> Pool Address -> Era -> Points.
 */

// Supported reward points batch keys.
export type PoolRewardPointsBatchKey = 'pool_list' | 'join_pool';

// Pool reward batches, keyed by batch key.
export type PoolRewardPointsBatch = Partial<Record<string, PoolRewardPoints>>;

// Pool reward points are keyed by era, then by pool address.

export type PoolRewardPoints = Record<PoolAddress, PointsByEra>;

export type PointsByEra = Record<EraKey, EraPoints>;

// Type aliases to better understand pool reward records.

export type PoolAddress = string;

export type EraKey = number;

export type EraPoints = string;
