// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { CanFastUnstakeResult } from '../types'

const QUERY = gql`
  query PoolRewards($network: String!, $who: String!) {
    canFastUnstake(network: $network, who: $who) {
      status
    }
  }
`

export const useCanFastUnstake = ({
  network,
  who,
}: {
  network: string
  who: string
}): CanFastUnstakeResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, who },
  })
  return { loading, error, data, refetch }
}
