// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { ActiveValidatorRanksData, QueryReturn } from '../types'

const QUERY = gql`
  query ActiveValidatorRanks($network: String!) {
    activeValidatorRanks(network: $network) {
      validator
      rank
    }
  }
`

const DEFAULT: ActiveValidatorRanksData = {
	activeValidatorRanks: [],
}

export const useActiveValidatorRanks = ({
	network,
}: {
	network: string
}): QueryReturn<ActiveValidatorRanksData> => {
	const { loading, error, data, refetch } = useQuery<ActiveValidatorRanksData>(
		QUERY,
		{
			variables: { network },
		},
	)

	return {
		loading,
		error,
		data: data || DEFAULT,
		refetch,
	}
}

export const fetchActiveValidatorRanks = async (
	network: string,
): Promise<ActiveValidatorRanksData> => {
	try {
		const result = await client.query<ActiveValidatorRanksData>({
			query: QUERY,
			variables: { network },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
