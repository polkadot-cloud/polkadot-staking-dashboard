// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { RpcEndpointChainHealth } from '../types'

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

export const fetchRpcEndpointHealth = async (
	network: string,
): Promise<RpcEndpointChainHealth> => {
	try {
		const result = await client.query({
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
