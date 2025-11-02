// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { AllRewardsResult } from '../types'

const QUERY = gql`
  query AllRewards($network: String!, $who: String!, $fromEra: Int!) {
    allRewards(network: $network, who: $who, fromEra: $fromEra) {
      claimed
      era
      reward
      timestamp
      validator
      type
    }
  }
`

export const useRewards = ({
	network,
	who,
	fromEra,
}: {
	network: string
	who: string
	fromEra: number
}): AllRewardsResult => {
	type AllRewardsData = {
		allRewards: Array<{
			era: number
			reward: string
			claimed: boolean
			timestamp: number
			validator: string
			type: string
		}>
	}
	const { loading, error, data, refetch } = useQuery<
		AllRewardsData,
		{ network: string; who: string; fromEra: number }
	>(QUERY, {
		variables: { network, who, fromEra },
	})
	return { loading, error, data: data!, refetch }
}

export const fetchRewards = async (
	network: string,
	who: string,
	fromEra: number,
) => {
	try {
		type AllRewardsData = {
			allRewards: Array<{
				era: number
				reward: string
				claimed: boolean
				timestamp: number
				validator: string
				type: string
			}>
		}
		const result = await client.query<
			AllRewardsData,
			{ network: string; who: string; fromEra: number }
		>({
			query: QUERY,
			variables: { network, who, fromEra },
		})
		return result.data?.allRewards ?? null
	} catch {
		return null
	}
}
