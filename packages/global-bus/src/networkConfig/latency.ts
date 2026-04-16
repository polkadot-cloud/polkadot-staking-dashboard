// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SystemChainList } from 'consts/networks'
import { getChainRpcEndpoints } from 'consts/util/rpc'
import type { NetworkId } from 'types'
import type { RpcLatencyData } from './local'

const CONNECTION_TIMEOUT_MS = 3000

// Measures WebSocket connection latency to an endpoint. Returns ms or Infinity on failure
const measureEndpointLatency = (url: string): Promise<number> =>
	new Promise((resolve) => {
		const start = performance.now()
		let resolved = false

		const timeout = setTimeout(() => {
			if (!resolved) {
				resolved = true
				resolve(Infinity)
			}
		}, CONNECTION_TIMEOUT_MS)

		try {
			const ws = new WebSocket(url)

			ws.onopen = () => {
				if (!resolved) {
					resolved = true
					clearTimeout(timeout)
					resolve(performance.now() - start)
				}
				ws.close()
			}

			ws.onerror = () => {
				if (!resolved) {
					resolved = true
					clearTimeout(timeout)
					resolve(Infinity)
				}
			}
		} catch {
			if (!resolved) {
				resolved = true
				clearTimeout(timeout)
				resolve(Infinity)
			}
		}
	})

// Measures latency to all RPC endpoints for a given chain in parallel
const measureChainLatencies = async (
	chainId: string,
): Promise<Record<string, number>> => {
	const endpoints = getChainRpcEndpoints(chainId)
	const entries = Object.entries(endpoints)

	const results = await Promise.all(
		entries.map(async ([label, url]) => ({
			label,
			latency: await measureEndpointLatency(url),
		})),
	)

	return results.reduce<Record<string, number>>((acc, { label, latency }) => {
		acc[label] = latency
		return acc
	}, {})
}

// Measures latency for all chains in a network (relay + system chains)
export const measureNetworkLatencies = async (
	network: NetworkId,
): Promise<RpcLatencyData> => {
	const chainIds = [
		network,
		...Object.entries(SystemChainList)
			.filter(([, c]) => c.relayChain === network)
			.map(([id]) => id),
	]

	const results = await Promise.all(
		chainIds.map(async (chainId) => ({
			chainId,
			latencies: await measureChainLatencies(chainId),
		})),
	)

	return results.reduce<RpcLatencyData>((acc, { chainId, latencies }) => {
		acc[chainId] = latencies
		return acc
	}, {})
}
