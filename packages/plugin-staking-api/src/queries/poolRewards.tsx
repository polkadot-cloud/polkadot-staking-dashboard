// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
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
