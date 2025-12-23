// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'

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

export const fetchPoolRewardTrend = async (
	network: string,
	who: string,
	duration: number,
) => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network, who, duration },
		})
		return result.data.poolRewardTrend
	} catch {
		return null
	}
}
