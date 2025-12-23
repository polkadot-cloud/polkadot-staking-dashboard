// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { ValidatorStatsData } from '../types'

const QUERY = gql`
  query ValidatorStats($network: String!) {
    validatorStats(network: $network) {
      averageRewardRate {
        rate
      }
      averageValidatorCommission
      activeValidatorRanks {
        rank
        validator
      }
    }
  }
`
const DEFAULT: ValidatorStatsData = {
	validatorStats: {
		averageRewardRate: {
			rate: 0,
		},
		averageValidatorCommission: 0,
		activeValidatorRanks: [],
	},
}

export const fetchValidatorStats = async (
	network: string,
): Promise<ValidatorStatsData> => {
	try {
		const result = await client.query<ValidatorStatsData>({
			query: QUERY,
			variables: { network },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
