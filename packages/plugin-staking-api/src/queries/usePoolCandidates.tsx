// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
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
