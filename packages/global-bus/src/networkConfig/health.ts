// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainRpcEndpoints } from 'consts/util/rpc'
import type { RpcHealthLabels } from 'plugin-staking-api/types'
import type { NetworkId, RpcEndpoints } from 'types'
import type { RpcLatencyData } from './local'
import { setLocalRpcEndpoints } from './local'

// Gets healthy endpoints for a given chain
export const getChainHealthyEndpoints = (
	chain: string,
	health: RpcHealthLabels | null,
) => health?.chains?.find((c) => c.chain === chain)?.endpoints || []

// Checks if the given chain endpoint is healthy
export const endpointIsHealthy = (
	key: string,
	healthyList: string[],
): boolean => !!healthyList?.find((label) => label === key)

// Picks the lowest-latency endpoint from a list, falling back to random
const pickByLatency = (
	candidates: string[],
	chainLatency: Record<string, number> | undefined,
): string => {
	if (!chainLatency || candidates.length === 0) {
		return candidates[Math.floor(Math.random() * candidates.length)]
	}

	let best = candidates[0]
	let bestLatency = chainLatency[best] ?? Infinity

	for (let i = 1; i < candidates.length; i++) {
		const latency = chainLatency[candidates[i]] ?? Infinity
		if (latency < bestLatency) {
			best = candidates[i]
			bestLatency = latency
		}
	}
	return best
}

// Sanitizes endpoints, replacing any unhealthy endpoints with the lowest-latency healthy one,
// or a random default if none are available
export const sanitizeEndpoints = (
	network: NetworkId,
	endpoints: RpcEndpoints,
	health: RpcHealthLabels,
	latency?: RpcLatencyData,
): RpcEndpoints => {
	const result: RpcEndpoints = {}

	for (const [chain, rpcKey] of Object.entries(endpoints)) {
		const healthyRpcs = getChainHealthyEndpoints(chain, health)
		const healthy = endpointIsHealthy(rpcKey, healthyRpcs)

		if (healthy) {
			result[chain] = rpcKey
			continue
		}

		// If not healthy, replace with the lowest-latency healthy provider
		if (healthyRpcs.length > 0) {
			const newRpc = pickByLatency(healthyRpcs, latency?.[chain])

			const newEndpointKey = Object.keys(getChainRpcEndpoints(chain)).find(
				(key) => key === newRpc,
			)
			if (newEndpointKey) {
				result[chain] = newRpc
				continue
			}
		}

		// No healthy endpoints found, use lowest-latency from defaults
		const defaultEndpoints = Object.keys(getChainRpcEndpoints(chain))
		result[chain] = pickByLatency(defaultEndpoints, latency?.[chain])
	}

	// Set sanitized endpoints in local storage
	setLocalRpcEndpoints(network, result)
	return result
}
