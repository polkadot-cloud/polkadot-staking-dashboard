// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { RpcEndpointHealthData } from '../types'

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

const DEFAULT: RpcEndpointHealthData = {
	rpcEndpointHealth: {
		chains: [],
	},
}

export const fetchRpcEndpointHealth = async (
	network: string,
): Promise<RpcEndpointHealthData> => {
	try {
		const result = await client.query<RpcEndpointHealthData>({
			query: QUERY,
			variables: { network },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
