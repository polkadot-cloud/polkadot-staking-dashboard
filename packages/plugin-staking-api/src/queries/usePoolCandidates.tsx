// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { PoolCandidatesResult } from '../types'

const QUERY = gql`
  query PoolCandidates($chain: String!) {
    poolCandidates(chain: $chain)
  }
`

export const usePoolCandidates = ({
  chain,
}: {
  chain: string
}): PoolCandidatesResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain },
  })
  return { loading, error, data, refetch }
}

export const fetchPoolCandidates = async (
  chain: string
): Promise<{ poolCandidates: number[] }> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { chain },
    })

    return result.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
