// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { addProxies, removeProxies } from '../state/proxies'
import type { ProxyRecord, StakingChain } from '../types'

export class ProxiesQuery<T extends StakingChain> {
	#unsub: Unsub | undefined = undefined

	constructor(
		public api: DedotClient<T>,
		public address: string,
	) {
		this.subscribe()
	}

	async subscribe() {
		this.#unsub = (await this.api.query.proxy.proxies(
			this.address,
			(result) => {
				const [proxies, deposit] = result
				const next: ProxyRecord = {
					proxies: proxies.map(({ delegate, proxyType, delay }) => ({
						delegate: delegate.address(this.api.consts.system.ss58Prefix),
						proxyType: String(proxyType),
						delay: Number(delay),
					})),
					deposit,
				}
				addProxies(this.address, next)
			},
		)) as Unsub
	}

	unsubscribe() {
		removeProxies(this.address)
		this.#unsub?.()
	}
}
