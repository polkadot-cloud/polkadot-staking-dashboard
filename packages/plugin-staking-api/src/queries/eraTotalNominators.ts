// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { EraTotalNominatorsResult } from '../types'

const QUERY = gql`
  query EraTotalNominators($network: String!, $era: Int!) {
    eraTotalNominators(network: $network, era: $era) {
      totalNominators
    }
  }
`

export const useEraTotalNominators = ({
	network,
	era,
}: {
	network: string
	era: number
}): EraTotalNominatorsResult => {
	const { loading, error, data, refetch } = useQuery<
		{ eraTotalNominators: { totalNominators: number } },
		{ network: string; era: number }
	>(QUERY, {
		variables: { network, era },
	})
	return { loading, error, data: { totalNominators: data?.eraTotalNominators?.totalNominators ?? 0 }, refetch }
}

export const fetchEraTotalNominators = async (
	network: string,
	era: number,
): Promise<number | null> => {
	try {
		const result = await client.query<
			{ eraTotalNominators: { totalNominators: number } },
			{ network: string; era: number }
		>({
			query: QUERY,
			variables: { network, era },
		})
		return result.data?.eraTotalNominators?.totalNominators ?? null
	} catch {
		return null
	}
}
