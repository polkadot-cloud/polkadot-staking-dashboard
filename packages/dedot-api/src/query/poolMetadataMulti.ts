// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MultiQueryBatchSize } from 'consts'
import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const poolMetadataMulti = async <T extends StakingChain>(
  api: DedotClient<T>,
  ids: number[]
) => {
  const batches = []

  for (let i = 0; i < ids.length; i += MultiQueryBatchSize) {
    batches.push(ids.slice(i, i + MultiQueryBatchSize))
  }
  const batchResults = await Promise.all(
    batches.map((batch) => api.query.nominationPools.metadata.multi(batch))
  )
  return batchResults.flat()
}
