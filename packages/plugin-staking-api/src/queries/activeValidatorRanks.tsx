// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { ActiveValidatorRank, ActiveValidatorRanksResult } from '../types'

const QUERY = gql`
  query ActiveValidatorRanks($chain: String!) {
    activeValidatorRanks(chain: $chain) {
      validator
      rank
    }
  }
`

export const useActiveValidatorRanks = ({
  chain,
}: {
  chain: string
}): ActiveValidatorRanksResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain },
  })
  return { loading, error, data, refetch }
}

export const fetchActiveValidatorRanks = async (
  chain: string
): Promise<{ activeValidatorRanks: ActiveValidatorRank[] }> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { chain },
    })
    return result.data
  } catch (error) {
    return {
      activeValidatorRanks: [],
    }
  }
}
