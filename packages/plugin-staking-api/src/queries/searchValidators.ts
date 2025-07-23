// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { SearchValidatorsData, SearchValidatorsResult } from '../types'

const QUERY = gql`
  query SearchValidators($network: String!, $searchTerm: String!) {
    searchValidators(network: $network, searchTerm: $searchTerm) {
      total
      validators {
        address
        commission
        blocked
        display
        superDisplay
      }
    }
  }
`

export const useSearchValidators = ({
  network,
  searchTerm,
}: {
  network: string
  searchTerm: string
}): SearchValidatorsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, searchTerm },
  })
  return { loading, error, data, refetch }
}

export const fetchSearchValidators = async (
  network: string,
  searchTerm: string
): Promise<SearchValidatorsData | null> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, searchTerm },
    })
    return result.data.searchValidators
  } catch (err) {
    return null
  }
}
