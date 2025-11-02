// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { PoolCandidatesResult } from '../types'

const QUERY = gql`
  query PoolCandidates($network: String!) {
    poolCandidates(network: $network)
  }
`

export const usePoolCandidates = ({
	network,
}: {
	network: string
}): PoolCandidatesResult => {
	const { loading, error, data, refetch } = useQuery<
		{ poolCandidates: number[] },
		{ network: string }
	>(QUERY, {
		variables: { network },
	})
	return { loading, error, data: data!, refetch }
}

export const fetchPoolCandidates = async (
	network: string,
): Promise<{ poolCandidates: number[] }> => {
	try {
		const result = await client.query<
			{ poolCandidates: number[] },
			{ network: string }
		>({
			query: QUERY,
			variables: { network },
		})

		return result.data ?? { poolCandidates: [] }
	} catch {
		return {
			poolCandidates: [],
		}
	}
}
