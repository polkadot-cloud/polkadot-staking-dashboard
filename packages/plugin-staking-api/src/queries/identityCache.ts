// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { IdentityCacheData } from '../types'

const QUERY = gql`
  query IdentityCache($network: String!, $addresses: [String!]!) {
    identityCache(network: $network, addresses: $addresses) {
      address
      display
      superDisplay
      superValue
    }
  }
`

const BATCH_SIZE = 500

export const fetchIdentityCache = async (
	network: string,
	addresses: string[],
): Promise<IdentityCacheData> => {
	// Batch addresses into chunks of BATCH_SIZE to avoid exceeding API limits
	const batches: string[][] = []
	for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
		batches.push(addresses.slice(i, i + BATCH_SIZE))
	}

	try {
		// Fetch all batches in parallel
		const results = await Promise.all(
			batches.map((batch) =>
				client.query<IdentityCacheData>({
					query: QUERY,
					variables: { network, addresses: batch },
				}),
			),
		)

		// Combine all results
		const combinedCache = results.flatMap(
			(result) => result?.data?.identityCache || [],
		)

		return { identityCache: combinedCache }
	} catch {
		return { identityCache: [] }
	}
}
