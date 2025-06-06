// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const balanceToPoints = async <T extends StakingChain>(
  api: DedotClient<T>,
  poolId: number,
  amount: bigint
) => await api.call.nominationPoolsApi.balanceToPoints(poolId, amount)
