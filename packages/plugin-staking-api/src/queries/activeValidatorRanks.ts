// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { ActiveValidatorRank, ActiveValidatorRanksResult } from '../types'

const QUERY = gql`
  query ActiveValidatorRanks($network: String!) {
    activeValidatorRanks(network: $network) {
      validator
      rank
    }
  }
`

export const useActiveValidatorRanks = ({
	network,
}: {
	network: string
}): ActiveValidatorRanksResult => {
	const { loading, error, data, refetch } = useQuery(QUERY, {
		variables: { network },
	})
	return { loading, error, data, refetch }
}

export const fetchActiveValidatorRanks = async (
	network: string,
): Promise<{ activeValidatorRanks: ActiveValidatorRank[] }> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network },
		})
		return result.data
	} catch {
		return {
			activeValidatorRanks: [],
		}
	}
}
