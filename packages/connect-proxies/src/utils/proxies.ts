// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SupportedProxies } from '../consts'

// Returns true if the given proxy type is registered in SupportedProxies
export const isSupportedProxy = (proxy: string) =>
	Object.keys(SupportedProxies).includes(proxy) || proxy === 'Any'

// Returns true if the given pallet/method call is permitted for the proxy type
export const isSupportedProxyCall = (
	proxy: string,
	pallet: string,
	method: string,
) => {
	if ([method, pallet].includes('undefined')) {
		return false
	}
	const call = `${pallet}.${method}`
	const calls = SupportedProxies[proxy]
	return (calls || []).find((c) => ['*', call].includes(c)) !== undefined
}
