// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { GenericSubstrateApi, Unsub } from 'dedot/types'
import { addProxies, removeProxies } from '../state/proxies'
import type { ProxyRecord, ProxyStateTuple } from '../types'

export class ProxiesQuery<T extends GenericSubstrateApi> {
	#unsub: Unsub | undefined = undefined

	constructor(
		public api: DedotClient<T>,
		public address: string,
	) {
		this.subscribe()
	}

	async subscribe() {
		try {
			const ss58Prefix: number = this.api.consts.system.ss58Prefix

			this.#unsub = await this.api.query.proxy.proxies(
				this.address,
				([proxies, deposit]: ProxyStateTuple) => {
					const next: ProxyRecord = {
						proxies: proxies.map(({ delegate, proxyType, delay }) => ({
							delegate: delegate.address(ss58Prefix),
							proxyType: String(proxyType),
							delay: Number(delay),
						})),
						deposit,
					}
					addProxies(this.address, next)
				},
			)
		} catch {
			// Proxy pallet absent or response in unexpected format — leave state empty for this address.
		}
	}

	unsubscribe() {
		removeProxies(this.address)
		this.#unsub?.()
	}
}
