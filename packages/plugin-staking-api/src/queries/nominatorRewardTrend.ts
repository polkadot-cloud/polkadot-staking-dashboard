// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { NominatorRewardTrendData, RewardTrend } from '../types'

const QUERY = gql`
  query NominatorRewardTrend($network: String!, $who: String!, $eras: Int!) {
    nominatorRewardTrend(network: $network, who: $who, eras: $eras) {
      reward
      previous
      change {
        percent
        value
      }
    }
  }
`

const DEFAULT: RewardTrend = {
	reward: '0',
	previous: '0',
	change: {
		percent: '0',
		value: '0',
	},
}

export const fetchNominatorRewardTrend = async (
	network: string,
	who: string,
	eras: number,
): Promise<RewardTrend> => {
	try {
		const result = await client.query<NominatorRewardTrendData>({
			query: QUERY,
			variables: { network, who, eras },
		})
		return result?.data?.nominatorRewardTrend || DEFAULT
	} catch {
		return DEFAULT
	}
}
