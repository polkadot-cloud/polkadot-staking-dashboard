// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { PoolCandidatesData } from '../types'

const QUERY = gql`
  query PoolCandidates($network: String!) {
    poolCandidates(network: $network)
  }
`

const DEFAULT: PoolCandidatesData = {
	poolCandidates: [],
}

export const fetchPoolCandidates = async (
	network: string,
): Promise<PoolCandidatesData> => {
	try {
		const result = await client.query<PoolCandidatesData>({
			query: QUERY,
			variables: { network },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
