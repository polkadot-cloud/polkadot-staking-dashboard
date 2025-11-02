// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { RewardTrendResult } from '../types'

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

export const useNominatorRewardTrend = ({
	network,
	who,
	eras,
}: {
	network: string
	who: string
	eras: number
}): RewardTrendResult => {
	type RewardTrendData = {
		nominatorRewardTrend: {
			reward: string
			previous: string
			change: { percent: string; value: string }
		}
	}
	const { loading, error, data, refetch } = useQuery<
		RewardTrendData,
		{ network: string; who: string; eras: number }
	>(QUERY, {
		variables: { network, who, eras },
	})
	return { loading, error, data: data as { rewardTrend: RewardTrend }, refetch }
}

export const fetchNominatorRewardTrend = async (
	network: string,
	who: string,
	eras: number,
) => {
	try {
		type RewardTrendData = {
			nominatorRewardTrend: {
				reward: string
				previous: string
				change: { percent: string; value: string }
			}
		}
		const result = await client.query<
			RewardTrendData,
			{ network: string; who: string; eras: number }
		>({
			query: QUERY,
			variables: { network, who, eras },
		})
		return result.data.nominatorRewardTrend
	} catch {
		return null
	}
}
