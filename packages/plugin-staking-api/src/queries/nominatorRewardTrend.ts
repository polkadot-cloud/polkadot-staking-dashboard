// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'

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

export const fetchNominatorRewardTrend = async (
	network: string,
	who: string,
	eras: number,
) => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network, who, eras },
		})
		return result.data.nominatorRewardTrend
	} catch {
		return null
	}
}
