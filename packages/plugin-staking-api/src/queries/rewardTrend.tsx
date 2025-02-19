// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { RewardTrendResult } from '../types'

const QUERY = gql`
  query RewardTrend($network: String!, $who: String!, $eras: Int!) {
    rewardTrend(network: $network, who: $who, eras: $eras) {
      reward
      previous
      change {
        percent
        value
      }
    }
  }
`

export const useRewardTrend = ({
  network,
  who,
  eras,
}: {
  network: string
  who: string
  eras: number
}): RewardTrendResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, who, eras },
  })
  return { loading, error, data, refetch }
}

export const fetchRewardTrend = async (
  network: string,
  who: string,
  eras: number
) => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, who, eras },
    })
    return result.data.rewardTrend
  } catch (error) {
    return null
  }
}
