// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from '@w3ux/types'
import type BigNumber from 'bignumber.js'
import type {
  PoolPerformanceTaskStatus,
  PoolRewardPoints,
  PoolRewardPointsKey,
} from 'types'

export interface PoolPerformanceContextInterface {
  getPoolRewardPoints: (key: PoolRewardPointsKey) => PoolRewardPoints
  getPoolPerformanceTask: (
    key: PoolRewardPointsKey
  ) => PoolPerformanceTaskStatus
  setNewPoolPerformanceTask: (
    key: PoolRewardPointsKey,
    status: Sync,
    addresses: string[],
    currentEra: BigNumber,
    endEra: BigNumber
  ) => void
  updatePoolPerformanceTask: (key: PoolRewardPointsKey, status: Sync) => void
  startPoolRewardPointsFetch: (
    key: PoolRewardPointsKey,
    addresses: string[]
  ) => void
}
