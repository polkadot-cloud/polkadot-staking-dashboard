// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { ActiveValidatorRanksData } from '../types'

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
