// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { PoolMembersData } from '../types'

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

const DEFAULT: PoolMembersData = {
	poolMembers: {
		poolId: 0,
		totalMembers: 0,
		members: [],
	},
}

export const fetchPoolMembers = async (
	network: string,
	poolId: number,
	limit?: number,
	offset?: number,
): Promise<PoolMembersData> => {
	try {
		const result = await client.query<PoolMembersData>({
			query: QUERY,
			variables: { network, poolId, limit, offset },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
