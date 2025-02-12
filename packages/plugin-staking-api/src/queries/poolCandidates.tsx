// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { PoolCandidatesResult } from '../types'

const QUERY = gql`
  query PoolCandidates($network: String!) {
    poolCandidates(network: $network)
  }
`

export const usePoolCandidates = ({
  network,
}: {
  network: string
}): PoolCandidatesResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network },
  })
  return { loading, error, data, refetch }
}

export const fetchPoolCandidates = async (
  network: string
): Promise<{ poolCandidates: number[] }> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network },
    })

    return result.data
  } catch (error) {
    return {
      poolCandidates: [],
    }
  }
}
