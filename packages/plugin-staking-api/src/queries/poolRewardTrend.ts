// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { RewardTrendData } from '../types'

const QUERY = gql`
  query PoolRewardTrend($network: String!, $who: String!, $duration: Int!) {
    poolRewardTrend(network: $network, who: $who, duration: $duration) {
      reward
      previous
      change {
        percent
        value
      }
    }
  }
`

const DEFAULT: RewardTrendData = {
	rewardTrend: {
		reward: '0',
		previous: '0',
		change: {
			percent: '0',
			value: '0',
		},
	},
}

export const fetchPoolRewardTrend = async (
	network: string,
	who: string,
	duration: number,
): Promise<RewardTrendData> => {
	try {
		const result = await client.query<RewardTrendData>({
			query: QUERY,
			variables: { network, who, duration },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
