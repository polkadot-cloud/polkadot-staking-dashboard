// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { SearchValidatorsData, SearchValidatorsResult } from '../types'

const QUERY = gql`
  query SearchValidators($network: String!, $searchTerm: String!) {
    searchValidators(network: $network, searchTerm: $searchTerm) {
      total
      validators {
        address
        commission
        blocked
        display
        superDisplay
      }
    }
  }
`

export const useSearchValidators = ({
	network,
	searchTerm,
}: {
	network: string
	searchTerm: string
}): SearchValidatorsResult => {
	const { loading, error, data, refetch } = useQuery<
		{ searchValidators: SearchValidatorsData },
		{ network: string; searchTerm: string }
	>(QUERY, {
		variables: { network, searchTerm },
	})
	return { loading, error, data: data?.searchValidators!, refetch }
}

export const fetchSearchValidators = async (
	network: string,
	searchTerm: string,
): Promise<SearchValidatorsData | null> => {
	try {
		const result = await client.query<
			{ searchValidators: SearchValidatorsData },
			{ network: string; searchTerm: string }
		>({
			query: QUERY,
			variables: { network, searchTerm },
		})
		return result.data?.searchValidators ?? null
	} catch {
		return null
	}
}
