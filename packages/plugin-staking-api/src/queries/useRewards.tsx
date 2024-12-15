// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { AllRewardsResult } from '../types'

const QUERY = gql`
  query AllRewards($chain: String!, $who: String!, $fromEra: Int!) {
    allRewards(chain: $chain, who: $who, fromEra: $fromEra) {
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
  chain,
  who,
  fromEra,
}: {
  chain: string
  who: string
  fromEra: number
}): AllRewardsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, who, fromEra },
  })
  return { loading, error, data, refetch }
}
