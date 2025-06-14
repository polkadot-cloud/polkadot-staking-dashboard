// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { RpcEndpointHealthResult } from '../types'

const QUERY = gql`
  query RpcEndpointHealth($network: String!) {
    rpcEndpointHealth(network: $network) {
      chains {
        endpoints
        chain
      }
    }
  }
`

export const useRpcEndpointHealth = ({
  network,
}: {
  network: string
}): RpcEndpointHealthResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network },
  })
  return { loading, error, data, refetch }
}

export const fetcRpcEndpointHealth = async (network: string) => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network },
    })
    return result.data.rpcEndpointHealth
  } catch (error) {
    return null
  }
}
