// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { QueryReturn, UnclaimedRewardsData } from '../types'

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

const DEFAULT: UnclaimedRewardsData = {
	unclaimedRewards: {
		total: '0',
		entries: [],
	},
}

export const useUnclaimedRewards = ({
	network,
	who,
	fromEra,
}: {
	network: string
	who: string
	fromEra: number
}): QueryReturn<UnclaimedRewardsData> => {
	const { loading, error, data, refetch } = useQuery<UnclaimedRewardsData>(
		QUERY,
		{
			variables: { network, who, fromEra },
		},
	)
	return { loading, error, data: data || DEFAULT, refetch }
}
