// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { EraTotalNominatorsData } from '../types'

const QUERY = gql`
  query EraTotalNominators($network: String!, $era: Int!) {
    eraTotalNominators(network: $network, era: $era) {
      totalNominators
    }
  }
`

const DEFAULT: EraTotalNominatorsData = {
	totalNominators: 0,
}

export const fetchEraTotalNominators = async (
	network: string,
	era: number,
): Promise<EraTotalNominatorsData> => {
	try {
		const result = await client.query<EraTotalNominatorsData>({
			query: QUERY,
			variables: { network, era },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
