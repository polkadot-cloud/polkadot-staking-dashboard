// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import type { PoolEraPointsResult } from '../types'

const QUERY = gql`
  query PoolEraPoints(
    $network: String!
    $poolId: Int!
    $fromEra: Int!
    $depth: Int
  ) {
    poolEraPoints(
      network: $network
      poolId: $poolId
      fromEra: $fromEra
      depth: $depth
    ) {
      era
      points
      start
    }
  }
`

export const usePoolEraPoints = ({
	network,
	poolId,
	fromEra,
	depth,
}: {
	network: string
	poolId: number
	fromEra: number
	depth?: number
}): PoolEraPointsResult => {
	type PoolEraPointsData = {
		poolEraPoints: Array<{ era: number; points: string; start: number }>
	}
	const { loading, error, data, refetch } = useQuery<
		PoolEraPointsData,
		{ network: string; poolId: number; fromEra: number; depth?: number }
	>(QUERY, {
		variables: { network, poolId, fromEra, depth },
	})
	return { loading, error, data, refetch }
}
