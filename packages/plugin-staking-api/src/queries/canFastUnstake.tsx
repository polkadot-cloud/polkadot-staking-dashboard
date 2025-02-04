// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { CanFastUnstakeResult } from '../types'

const QUERY = gql`
  query PoolRewards($chain: String!, $who: String!) {
    canFastUnstake(chain: $chain, who: $who) {
      status
    }
  }
`

export const useCanFastUnstake = ({
  chain,
  who,
}: {
  chain: string
  who: string
}): CanFastUnstakeResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, who },
  })
  return { loading, error, data, refetch }
}
