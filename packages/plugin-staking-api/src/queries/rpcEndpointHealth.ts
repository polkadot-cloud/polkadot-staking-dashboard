// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { RpcEndpointChainHealth, RpcEndpointHealthResult } from '../types'

const QUERY = gql`
  query RpcEndpointHealth($network: String!) {
    rpcEndpointHealth(network: $network) {
      chains {
        endpoints {
          label
          url
        }
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
	const { loading, error, data, refetch } = useQuery<
		{ rpcEndpointHealth: RpcEndpointChainHealth },
		{ network: string }
	>(QUERY, {
		variables: { network },
	})
	return { loading, error, data: data as RpcEndpointChainHealth, refetch }
}

export const fetchRpcEndpointHealth = async (
	network: string,
): Promise<RpcEndpointChainHealth> => {
	try {
		const result = await client.query<
			{ rpcEndpointHealth: RpcEndpointChainHealth },
			{ network: string }
		>({
			query: QUERY,
			variables: { network },
		})
		return result.data.rpcEndpointHealth
	} catch {
		return {
			chains: [],
		}
	}
}
