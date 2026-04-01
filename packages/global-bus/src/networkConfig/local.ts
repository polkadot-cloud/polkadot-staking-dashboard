// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	AutoRpcKey,
	NetworkKey,
	ProviderTypeKey,
	rpcEndpointKey,
	rpcHealthCacheKey,
	rpcLatencyCacheKey,
} from 'consts'
import type { RpcHealthLabels } from 'plugin-staking-api/types'
import type { NetworkId, ProviderType, RpcEndpoints } from 'types'

export const setLocalNetwork = (network: NetworkId) => {
	localStorage.setItem(NetworkKey, network)
}

export const setLocalRpcEndpoints = (
	network: NetworkId,
	rpcEndpoints: RpcEndpoints,
) => {
	localStorage.setItem(rpcEndpointKey(network), JSON.stringify(rpcEndpoints))
}

export const setLocalProviderType = (providerType: ProviderType) => {
	localStorage.setItem(ProviderTypeKey, providerType)
}

export const setLocalAutoRpc = (autoRpc: boolean) => {
	localStorage.setItem(AutoRpcKey, String(autoRpc))
}

// Cache structure for RPC health data
interface RpcHealthCache {
	timestamp: number
	data: RpcHealthLabels
}

// Set cached RPC health data with timestamp
export const setLocalRpcHealthCache = (
	network: NetworkId,
	healthData: RpcHealthLabels,
) => {
	const cache: RpcHealthCache = {
		timestamp: Date.now(),
		data: healthData,
	}
	localStorage.setItem(rpcHealthCacheKey(network), JSON.stringify(cache))
}

// Get cached RPC health data if it's within 1 hour
export const getLocalRpcHealthCache = (
	network: NetworkId,
): RpcHealthLabels | null => {
	try {
		const cached = localStorage.getItem(rpcHealthCacheKey(network))
		if (!cached) {
			return null
		}

		const cache: RpcHealthCache = JSON.parse(cached)
		const now = Date.now()
		const oneHourInMs = 60 * 60 * 1000 // 1 hour in milliseconds

		// Check if cache is still valid (within 1 hour)
		if (now - cache.timestamp < oneHourInMs) {
			return cache.data
		}

		// Cache is expired, remove it
		localStorage.removeItem(rpcHealthCacheKey(network))
		return null
	} catch {
		// Invalid cache data, remove it
		localStorage.removeItem(rpcHealthCacheKey(network))
		return null
	}
}

// Latency data: chainId -> { providerLabel: latencyMs }
export type RpcLatencyData = Record<string, Record<string, number>>

// Cache structure for RPC latency data
interface RpcLatencyCache {
	timestamp: number
	data: RpcLatencyData
}

// Set cached RPC latency data with timestamp
export const setLocalRpcLatencyCache = (
	network: NetworkId,
	latencyData: RpcLatencyData,
) => {
	const cache: RpcLatencyCache = {
		timestamp: Date.now(),
		data: latencyData,
	}
	localStorage.setItem(rpcLatencyCacheKey(network), JSON.stringify(cache))
}

// Get cached RPC latency data if it's within 1 hour
export const getLocalRpcLatencyCache = (
	network: NetworkId,
): RpcLatencyData | null => {
	try {
		const cached = localStorage.getItem(rpcLatencyCacheKey(network))
		if (!cached) {
			return null
		}

		const cache: RpcLatencyCache = JSON.parse(cached)
		const now = Date.now()
		const oneHourInMs = 60 * 60 * 1000

		if (now - cache.timestamp < oneHourInMs) {
			return cache.data
		}

		localStorage.removeItem(rpcLatencyCacheKey(network))
		return null
	} catch {
		localStorage.removeItem(rpcLatencyCacheKey(network))
		return null
	}
}
