// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'
import { asTx } from '../util'

export const poolSetCommissionChangeRate = <T extends StakingChain>(
  api: DedotClient<T>,
  poolId: number,
  maxIncrease: number,
  minDelay: number
) =>
  asTx(
    api.tx.nominationPools.setCommissionChangeRate(poolId, {
      maxIncrease,
      minDelay,
    })
  )
