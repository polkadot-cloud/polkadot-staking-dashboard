// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { UnclaimedRewardsResult } from '../types'

const QUERY = gql`
  query UnclaimedRewards($chain: String!, $who: String!, $fromEra: Int!) {
    unclaimedRewards(chain: $chain, who: $who, fromEra: $fromEra) {
      total
      entries {
        era
        reward
        validators {
          page
          reward
          validator
        }
      }
    }
  }
`

export const useUnclaimedRewards = ({
  chain,
  who,
  fromEra,
}: {
  chain: string
  who: string
  fromEra: number
}): UnclaimedRewardsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, who, fromEra },
  })
  return { loading, error, data, refetch }
}
