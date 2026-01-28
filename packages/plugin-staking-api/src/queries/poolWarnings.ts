// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { PoolWarningsData, PoolWarningsResult } from '../types'

const QUERY = gql`
	query PoolWarnings($network: String!, $addresses: [String!]!) {
		destroyingPoolMembers(network: $network, addresses: $addresses) {
			members {
				poolId
				address
			}
		}
		highCommissionPoolMembers(network: $network, addresses: $addresses) {
			members {
				poolId
				address
			}
		}
	}
`

const DEFAULT: PoolWarningsResult = {
	destroyingPools: [],
	highCommissionPools: [],
}

export const fetchPoolWarnings = async (
	network: string,
	addresses: string[],
): Promise<PoolWarningsResult> => {
	if (addresses.length === 0) {
		return DEFAULT
	}

	try {
		const result = await client.query<PoolWarningsData>({
			query: QUERY,
			variables: { network, addresses },
		})

		return {
			destroyingPools: result?.data?.destroyingPoolMembers?.members || [],
			highCommissionPools:
				result?.data?.highCommissionPoolMembers?.members || [],
		}
	} catch {
		return DEFAULT
	}
}
