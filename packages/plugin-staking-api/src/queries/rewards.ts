// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { AllRewardsData, QueryReturn } from '../types'

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

const DEFAULT: AllRewardsData = {
	allRewards: [],
}

export const useRewards = ({
	network,
	who,
	fromEra,
}: {
	network: string
	who: string
	fromEra: number
}): QueryReturn<AllRewardsData> => {
	const { loading, error, data, refetch } = useQuery<AllRewardsData>(QUERY, {
		variables: { network, who, fromEra },
	})
	return { loading, error, data: data || DEFAULT, refetch }
}

export const fetchRewards = async (
	network: string,
	who: string,
	fromEra: number,
): Promise<AllRewardsData> => {
	try {
		const result = await client.query<AllRewardsData>({
			query: QUERY,
			variables: { network, who, fromEra },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
