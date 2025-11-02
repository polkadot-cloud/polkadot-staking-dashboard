// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { RewardTrendResult } from '../types'

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

export const usePoolRewardTrend = ({
	network,
	who,
	duration,
}: {
	network: string
	who: string
	duration: number
}): RewardTrendResult => {
	type PoolRewardTrendData = {
		poolRewardTrend: {
			reward: string
			previous: string
			change: { percent: string; value: string }
		}
	}
	const { loading, error, data, refetch } = useQuery<
		PoolRewardTrendData,
		{ network: string; who: string; duration: number }
	>(QUERY, {
		variables: { network, who, duration },
	})
	return { loading, error, data: { rewardTrend: data?.poolRewardTrend! }, refetch }
}

export const fetchPoolRewardTrend = async (
	network: string,
	who: string,
	duration: number,
) => {
	try {
		type PoolRewardTrendData = {
			poolRewardTrend: {
				reward: string
				previous: string
				change: { percent: string; value: string }
			}
		}
		const result = await client.query<
			PoolRewardTrendData,
			{ network: string; who: string; duration: number }
		>({
			query: QUERY,
			variables: { network, who, duration },
		})
		return result.data?.poolRewardTrend ?? null
	} catch {
		return null
	}
}
