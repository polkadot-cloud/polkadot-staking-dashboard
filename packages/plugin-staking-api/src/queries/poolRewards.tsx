// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { PoolRewardResults } from '../types'

const QUERY = gql`
  query PoolRewards($chain: String!, $who: String!, $from: Int!) {
    poolRewards(chain: $chain, who: $who, from: $from) {
      poolId
      reward
      timestamp
      who
    }
  }
`

export const usePoolRewards = ({
  chain,
  who,
  from,
}: {
  chain: string
  who: string
  from: number
}): PoolRewardResults => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, who, from },
  })
  return { loading, error, data, refetch }
}
