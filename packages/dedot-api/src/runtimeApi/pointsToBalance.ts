// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const pointsToBalance = async <T extends StakingChain>(
  api: DedotClient<T>,
  poolId: number,
  points: bigint
) => await api.call.nominationPoolsApi.pointsToBalance(poolId, points)
