// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { PoolEraPointsResult } from '../types'

const QUERY = gql`
  query PoolEraPoints($chain: String!, $poolId: String!, $fromEra: Int!) {
    poolEraPoints(chain: $chain, poolId: $poolId, fromEra: $fromEra) {
      era
      points
      start
    }
  }
`

export const usePoolEraPoints = ({
  chain,
  poolId,
  fromEra,
}: {
  chain: string
  poolId: number
  fromEra: number
}): PoolEraPointsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, poolId, fromEra },
  })
  return { loading, error, data, refetch }
}
