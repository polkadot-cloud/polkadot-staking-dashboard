// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { PoolRewardResults } from '../types'

const QUERY = gql`
  query PoolRewards($network: String!, $who: String!, $from: Int!) {
    poolRewards(network: $network, who: $who, from: $from) {
      poolId
      reward
      timestamp
      who
    }
  }
`

export const usePoolRewards = ({
  network,
  who,
  from,
}: {
  network: string
  who: string
  from: number
}): PoolRewardResults => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, who, from },
  })
  return { loading, error, data, refetch }
}

export const fetchPoolRewards = async (
  network: string,
  who: string,
  from: number
) => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, who, from },
    })
    return result.data.poolRewards
  } catch {
    return null
  }
}
