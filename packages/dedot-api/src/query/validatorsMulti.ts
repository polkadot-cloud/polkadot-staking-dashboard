// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MultiQueryBatchSize } from 'consts'
import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const validatorsMulti = async <T extends StakingChain>(
  api: DedotClient<T>,
  addresses: string[]
) => {
  const batches = []

  for (let i = 0; i < addresses.length; i += MultiQueryBatchSize) {
    batches.push(addresses.slice(i, i + MultiQueryBatchSize))
  }
  const results = await Promise.all(
    batches.map((batch) => api.query.staking.validators.multi(batch))
  )
  return results.flat()
}
