// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MultiQueryBatchSize } from 'consts'
import type { DedotClient } from 'dedot'
import type { SuperOf } from 'types'
import type { PeopleChain } from '../types'
import { identityOfMulti } from './identityOfMulti'

export const superOfMulti = async <T extends PeopleChain>(
  api: DedotClient<T>,
  addresses: string[],
  ss58: number
): Promise<SuperOf[]> => {
  const batches = []

  for (let i = 0; i < addresses.length; i += MultiQueryBatchSize) {
    batches.push(addresses.slice(i, i + MultiQueryBatchSize))
  }
  const batchResults = await Promise.all(
    batches.map((batch) => api.query.identity.superOf.multi(batch))
  )
  const flatResults = batchResults.flat()
  const result = flatResults
    .map((item, i) => {
      if (!item) {
        return undefined
      }
      return {
        address: addresses[i],
        account: item[0],
        value: {
          type: item[1]?.type,
          value: 'value' in item[1] ? item[1].value : undefined,
        },
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  // Fetch the identity of the super accounts and inject them into result
  const superAddresses = result.map(({ account }) => account.address(ss58))
  const superIdentities = await identityOfMulti(api, superAddresses)
  const supers = result.map((item, i) => ({
    ...item,
    identity: superIdentities[i],
  }))
  return supers
}
