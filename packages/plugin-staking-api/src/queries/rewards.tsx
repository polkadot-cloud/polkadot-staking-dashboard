// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { AllRewardsResult } from '../types'

const QUERY = gql`
  query AllRewards($network: String!, $who: String!, $fromEra: Int!) {
    allRewards(network: $network, who: $who, fromEra: $fromEra) {
      claimed
      era
      reward
      timestamp
      validator
      type
    }
  }
`

export const useRewards = ({
  network,
  who,
  fromEra,
}: {
  network: string
  who: string
  fromEra: number
}): AllRewardsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, who, fromEra },
  })
  return { loading, error, data, refetch }
}

export const fetchRewards = async (
  network: string,
  who: string,
  fromEra: number
) => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, who, fromEra },
    })
    return result.data.allRewards
  } catch (error) {
    return null
  }
}
