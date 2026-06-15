// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainRpcEndpoints } from 'consts/util/rpc'

// Latency for a single chain's providers: providerLabel -> latencyMs (Infinity on failure)
export type ChainLatencies = Record<string, number>

// Latency across chains: chainId -> ChainLatencies
export type RpcLatencyData = Record<string, ChainLatencies>

// Invoked as each endpoint measurement resolves, so callers can render progress incrementally
export type LatencyProgressCallback = (label: string, latencyMs: number) => void

const CONNECTION_TIMEOUT_MS = 3000

// Measures WebSocket connection latency to an endpoint. Returns ms or Infinity on failure
const measureEndpointLatency = (url: string): Promise<number> =>
	new Promise((resolve) => {
		const start = performance.now()
		let resolved = false
		let ws: WebSocket | undefined

		// Resolve once, always tearing down the timer and socket regardless of which path wins
		const finish = (value: number) => {
			if (resolved) {
				return
			}
			resolved = true
			clearTimeout(timeout)
			ws?.close()
			resolve(value)
		}

		const timeout = setTimeout(() => finish(Infinity), CONNECTION_TIMEOUT_MS)

		try {
			ws = new WebSocket(url)
			ws.onopen = () => finish(performance.now() - start)
			ws.onerror = () => finish(Infinity)
			// Some failures close the socket without firing onerror; resolve immediately rather
			// than waiting out the full timeout. No-op after a successful open (finish is idempotent)
			ws.onclose = () => finish(Infinity)
		} catch {
			finish(Infinity)
		}
	})

// Measures latency to all RPC endpoints for a given chain in parallel. Invokes onResult as each
// endpoint resolves so callers can update the UI progressively
export const measureChainLatencies = async (
	chainId: string,
	onResult?: LatencyProgressCallback,
): Promise<ChainLatencies> => {
	const entries = Object.entries(getChainRpcEndpoints(chainId))

	const results = await Promise.all(
		entries.map(async ([label, url]) => {
			const latency = await measureEndpointLatency(url)
			onResult?.(label, latency)
			return { label, latency }
		}),
	)

	return results.reduce<ChainLatencies>((acc, { label, latency }) => {
		acc[label] = latency
		return acc
	}, {})
}
