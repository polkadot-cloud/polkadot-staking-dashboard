// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { PoolEraRewardsData, QueryReturn } from '../types'

const QUERY = gql`
  query PoolEraRewards($network: String!, $who: String!, $fromEra: Int!) {
    poolEraRewards(network: $network, who: $who, fromEra: $fromEra) {
      who
      poolId
      reward
      timestamp
    }
  }
`

const DEFAULT: PoolEraRewardsData = {
	poolEraRewards: [],
}

export const usePoolEraRewards = ({
	network,
	who,
	fromEra,
	skip,
}: {
	network: string
	who: string
	fromEra: number
	skip?: boolean
}): QueryReturn<PoolEraRewardsData> => {
	const { loading, error, data, refetch } = useQuery<PoolEraRewardsData>(
		QUERY,
		{
			variables: { network, who, fromEra },
			skip,
		},
	)
	return { loading, error, data: data || DEFAULT, refetch }
}

export const fetchPoolEraRewards = async (
	network: string,
	who: string,
	fromEra: number,
): Promise<PoolEraRewardsData> => {
	try {
		const result = await client.query<PoolEraRewardsData>({
			query: QUERY,
			variables: { network, who, fromEra },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
