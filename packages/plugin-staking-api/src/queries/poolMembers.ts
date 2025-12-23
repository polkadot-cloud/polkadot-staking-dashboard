// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import { client } from '../Client'
import type { PoolMembersData, PoolMembersResult } from '../types'

const QUERY = gql`
	query PoolMembers($network: String!, $poolId: Int!, $limit: Int, $offset: Int) {
		poolMembers(network: $network, poolId: $poolId, limit: $limit, offset: $offset) {
			poolId
			totalMembers
			members {
      	poolId
				address
				points
				unbondingEras {
					era
					amount
				}
			}
		}
	}
`

export const usePoolMembers = ({
	network,
	poolId,
	limit,
	offset,
}: {
	network: string
	poolId: number
	limit?: number
	offset?: number
}): PoolMembersResult => {
	const { loading, error, data, refetch } = useQuery(QUERY, {
		variables: { network, poolId, limit, offset },
	})
	return { loading, error, data, refetch }
}

export const fetchPoolMembers = async (
	network: string,
	poolId: number,
	limit?: number,
	offset?: number,
): Promise<PoolMembersData | null> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network, poolId, limit, offset },
		})
		return result.data.poolMembers
	} catch {
		return null
	}
}
