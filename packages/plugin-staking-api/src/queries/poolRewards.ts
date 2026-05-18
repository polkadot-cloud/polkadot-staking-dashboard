// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import type { PoolRewardData, QueryReturn } from '../types'
import { fetchQuery, useApiQuery } from './generic'

const QUERY = gql`
  query PoolRewards($network: String!, $who: String!, $from: Int!) {
    poolRewards(network: $network, who: $who, from: $from) {
      poolId
      reward
      timestamp
      who
    }
  }
`

const DEFAULT: PoolRewardData = {
	poolRewards: [],
}

export const usePoolRewards = (variables: {
	network: string
	who: string
	from: number
}): QueryReturn<PoolRewardData> =>
	useApiQuery<PoolRewardData>(QUERY, variables, DEFAULT)

export const fetchPoolRewards = (network: string, who: string, from: number) =>
	fetchQuery<PoolRewardData>(QUERY, { network, who, from }, DEFAULT)
