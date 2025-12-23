// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { PoolEraPointsData, QueryReturn } from '../types'

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

const DEFAULT: PoolEraPointsData = {
	poolEraPoints: [],
}

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
}): QueryReturn<PoolEraPointsData> => {
	const { loading, error, data, refetch } = useQuery<PoolEraPointsData>(QUERY, {
		variables: { network, poolId, fromEra, depth },
	})
	return { loading, error, data: data || DEFAULT, refetch }
}
