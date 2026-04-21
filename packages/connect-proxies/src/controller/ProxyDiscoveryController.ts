// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { importedAccounts$ } from '@polkadot-cloud/connect-core'
import type { DedotClient } from 'dedot'
import type { GenericSubstrateApi } from 'dedot/types'
import { pairwise, type Subscription, startWith } from 'rxjs'
import { resetProxies } from '../state/proxies'
import { ProxiesQuery } from '../subscribe/ProxiesQuery'

// Manages the lifecycle of per-account proxy chain subscriptions. Accepts any
// consumer-provided DedotClient at runtime (lazy — not at provider mount).
// Subscriptions start on first start() call, are ref-counted, and are torn
// down when the last consumer calls stop() or when the client changes.
export class ProxyDiscoveryController {
	#api: DedotClient<GenericSubstrateApi> | null = null
	#subscriptions: Record<string, ProxiesQuery<GenericSubstrateApi>> = {}
	#accountSub: Subscription | null = null
	#refCount = 0

	start<T extends GenericSubstrateApi>(api: DedotClient<T>): void {
		const castApi = api as unknown as DedotClient<GenericSubstrateApi>
		this.#refCount++

		if (this.#api === castApi) {
			// Same client already running — nothing to do
			return
		}

		if (this.#api !== null) {
			// Client swapped — tear down existing subscriptions before rebinding
			this.#teardown()
		}

		this.#api = castApi
		this.#subscribeAccounts()
	}

	stop(): void {
		this.#refCount = Math.max(0, this.#refCount - 1)
		if (this.#refCount === 0) {
			this.#teardown()
		}
	}

	#subscribeAccounts() {
		this.#accountSub = importedAccounts$
			.pipe(startWith([], []), pairwise())
			.subscribe(([prev, cur]) => {
				const api = this.#api
				if (!api) return

				// Flatten nested account arrays and extract unique addresses
				const prevAddrs = new Set(
					(prev as { address: string }[][]).flat().map((a) => a.address),
				)
				const curAddrs = new Set(
					(cur as { address: string }[][]).flat().map((a) => a.address),
				)

				// Unsubscribe from removed addresses
				for (const addr of prevAddrs) {
					if (!curAddrs.has(addr)) {
						this.#subscriptions[addr]?.unsubscribe()
						delete this.#subscriptions[addr]
					}
				}

				// Subscribe to newly added addresses
				for (const addr of curAddrs) {
					if (!prevAddrs.has(addr) && !this.#subscriptions[addr]) {
						this.#subscriptions[addr] = new ProxiesQuery(api, addr)
					}
				}
			})
	}

	#teardown() {
		this.#accountSub?.unsubscribe()
		this.#accountSub = null
		for (const query of Object.values(this.#subscriptions)) {
			query.unsubscribe()
		}
		this.#subscriptions = {}
		resetProxies()
		this.#api = null
	}
}
