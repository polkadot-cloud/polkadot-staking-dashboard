// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { GenericSubstrateApi } from 'dedot/types'
import type { PalletProxyProxyDefinition, ProxyStateTuple } from '../types'

// One-shot query returning the delegate addresses for a given delegator. Used by consumers that
// need a point-in-time check (e.g. manual proxy declaration) without maintaining a live
// subscription. Accepts any Dedot client whose chain exposes `proxy.proxies`.
export const queryProxies = async <T extends GenericSubstrateApi>(
	api: DedotClient<T>,
	address: string,
): Promise<string[]> => {
	try {
		const [proxies]: ProxyStateTuple = await api.query.proxy.proxies(address)
		const ss58Prefix: number = api.consts.system.ss58Prefix
		return (proxies as PalletProxyProxyDefinition[]).map((r) =>
			r.delegate.address(ss58Prefix),
		)
	} catch {
		// Proxy pallet absent or response in unexpected format — treat as no proxies.
		return []
	}
}
