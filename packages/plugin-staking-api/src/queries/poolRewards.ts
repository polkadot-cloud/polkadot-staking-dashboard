// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { PoolRewardData, QueryReturn } from '../types'

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

const DEFAULT: PoolRewardData = {
	poolRewards: [],
}

export const usePoolRewards = ({
	network,
	who,
	from,
}: {
	network: string
	who: string
	from: number
}): QueryReturn<PoolRewardData> => {
	const { loading, error, data, refetch } = useQuery<PoolRewardData>(QUERY, {
		variables: { network, who, from },
	})
	return { loading, error, data: data || DEFAULT, refetch }
}

export const fetchPoolRewards = async (
	network: string,
	who: string,
	from: number,
): Promise<PoolRewardData> => {
	try {
		const result = await client.query<PoolRewardData>({
			query: QUERY,
			variables: { network, who, from },
		})
		return result.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
