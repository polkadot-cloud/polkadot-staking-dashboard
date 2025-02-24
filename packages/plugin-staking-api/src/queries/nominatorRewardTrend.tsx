// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { RewardTrendResult } from '../types'

const QUERY = gql`
  query NominatorRewardTrend($network: String!, $who: String!, $eras: Int!) {
    nominatorRewardTrend(network: $network, who: $who, eras: $eras) {
      reward
      previous
      change {
        percent
        value
      }
    }
  }
`

export const useNominatorRewardTrend = ({
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

export const fetchNominatorRewardTrend = async (
  network: string,
  who: string,
  eras: number
) => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, who, eras },
    })
    return result.data.nominatorRewardTrend
  } catch (error) {
    return null
  }
}
