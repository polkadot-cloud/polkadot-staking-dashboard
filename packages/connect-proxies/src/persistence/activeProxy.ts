// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { ActiveProxiesKey } from '../consts'
import type { ActiveProxy, LocalActiveProxies } from '../types'

export const getLocalActiveProxies = () =>
	localStorageOrDefault(ActiveProxiesKey, {}, true) as LocalActiveProxies

export const getLocalActiveProxy = (network: string): ActiveProxy | null => {
	const proxies = getLocalActiveProxies()
	return proxies[network] || null
}

export const setLocalActiveProxy = (
	network: string,
	proxy: ActiveProxy | null,
) => {
	if (!proxy) {
		removeLocalActiveProxy(network)
	} else {
		const proxies = { ...getLocalActiveProxies() }
		proxies[network] = proxy
		localStorage.setItem(ActiveProxiesKey, JSON.stringify(proxies))
	}
}

export const removeLocalActiveProxy = (network: string) => {
	const proxies = { ...getLocalActiveProxies() }
	delete proxies[network]
	localStorage.setItem(ActiveProxiesKey, JSON.stringify(proxies))
}
