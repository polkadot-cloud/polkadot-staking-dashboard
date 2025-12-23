// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { SearchValidatorsData } from '../types'

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

const DEFAULT: SearchValidatorsData = {
	searchValidators: {
		total: 0,
		validators: [],
	},
}

export const fetchSearchValidators = async (
	network: string,
	searchTerm: string,
): Promise<SearchValidatorsData> => {
	try {
		const result = await client.query<SearchValidatorsData>({
			query: QUERY,
			variables: { network, searchTerm },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
