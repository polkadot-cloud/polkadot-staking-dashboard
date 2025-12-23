// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'

const QUERY = gql`
  query PoolCandidates($network: String!) {
    poolCandidates(network: $network)
  }
`

export const fetchPoolCandidates = async (
	network: string,
): Promise<{ poolCandidates: number[] }> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network },
		})

		return result.data
	} catch {
		return {
			poolCandidates: [],
		}
	}
}
