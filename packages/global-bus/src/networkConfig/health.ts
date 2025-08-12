// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainRpcEndpoints } from 'consts/util/rpc'
import type { RpcEndpointChainHealth } from 'plugin-staking-api/types'
import type { NetworkId, RpcEndpoints } from 'types'
import { setLocalRpcEndpoints } from './local'
import { getRpcEndpointFromKey } from './util'

// Gets healthy endpoints for a given chain
export const getChainHealthyEndpoints = (
	chain: string,
	health: RpcEndpointChainHealth | null,
) => health?.chains?.find((c) => c.chain === chain)?.endpoints || []

// Checks if the given chain endpoint is healthy
export const endpointIsHealthy = (
	endpoint: string,
	healthyEndpoints: string[],
): boolean => !!healthyEndpoints?.find((url) => url === endpoint)

// Sanitizes endpoints, replacing any unhealthy endpoints with a healthy one, or a random default if
// none are available
export const sanitizeEndpoints = (
	network: NetworkId,
	endpoints: RpcEndpoints,
	health: RpcEndpointChainHealth,
): RpcEndpoints => {
	const result: RpcEndpoints = {}

	for (const [chain, rpcKey] of Object.entries(endpoints)) {
		const endpoint = getRpcEndpointFromKey(chain, rpcKey)
		const healthyEndpoints = getChainHealthyEndpoints(chain, health)

		const healthy = endpoint
			? endpointIsHealthy(endpoint, healthyEndpoints)
			: false

		if (healthy) {
			result[chain] = rpcKey
			continue
		}

		// If not healthy, replace with a random healthy endpoint
		if (healthyEndpoints.length > 0) {
			const newEndpoint =
				healthyEndpoints[Math.floor(healthyEndpoints.length * Math.random())]

			// Get rpcKey from the new endpoint
			const newEndpointKey = Object.keys(getChainRpcEndpoints(chain)).find(
				(key) => getRpcEndpointFromKey(chain, key) === newEndpoint,
			)
			if (newEndpointKey) {
				result[chain] = newEndpoint
				continue
			}
		}

		// No healthy endpoints found, use random endpoint from defaults
		const defaultEndpoints = Object.keys(getChainRpcEndpoints(chain))
		result[chain] =
			defaultEndpoints[Math.floor(defaultEndpoints.length * Math.random())]
	}

	// Set sanitized endpoints in local storage
	setLocalRpcEndpoints(network, result)
	return result
}
