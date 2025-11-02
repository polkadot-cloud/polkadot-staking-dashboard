// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import type { UnclaimedRewardsResult } from '../types'

const QUERY = gql`
  query UnclaimedRewards($network: String!, $who: String!, $fromEra: Int!) {
    unclaimedRewards(network: $network, who: $who, fromEra: $fromEra) {
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
	network,
	who,
	fromEra,
}: {
	network: string
	who: string
	fromEra: number
}): UnclaimedRewardsResult => {
	type UnclaimedRewardsData = {
		unclaimedRewards: {
			total: string
			entries: Array<{
				era: number
				reward: string
				validators: Array<{
					page: number | null
					reward: string
					validator: string
				}>
			}>
		}
	}
	const { loading, error, data, refetch } = useQuery<
		UnclaimedRewardsData,
		{ network: string; who: string; fromEra: number }
	>(QUERY, {
		variables: { network, who, fromEra },
	})
	return { loading, error, data: data!, refetch }
}
