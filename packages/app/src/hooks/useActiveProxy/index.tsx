// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { activeProxy$ } from '@polkadot-cloud/connect-proxies'
import { useSyncExternalStore } from 'react'
import type { ActiveProxy } from 'types'
import type { ActiveProxyHookInterface } from './types'

// A single RxJS subscription shared across every hook instance. The current value is cached in a a
// module-level variable so useSyncExternalStore has a synchronous snapshot to read from. The
// subscription is reference-counted: created when the first component mounts and torn down when the
// last one unmounts, so no RxJS subscriber is held open while the hook has no consumers.
let currentActiveProxy: ActiveProxy | null = null
const activeProxyListeners = new Set<() => void>()
let activeProxyRxSubscription: { unsubscribe(): void } | null = null

function subscribeToActiveProxy(onStoreChange: () => void): () => void {
	if (activeProxyListeners.size === 0) {
		activeProxyRxSubscription = activeProxy$.subscribe((result) => {
			currentActiveProxy = result
			for (const listener of activeProxyListeners) {
				listener()
			}
		})
	}
	activeProxyListeners.add(onStoreChange)
	return () => {
		activeProxyListeners.delete(onStoreChange)
		if (activeProxyListeners.size === 0) {
			activeProxyRxSubscription?.unsubscribe()
			activeProxyRxSubscription = null
		}
	}
}

export const useActiveProxy = (): ActiveProxyHookInterface => {
	const activeProxy = useSyncExternalStore(
		subscribeToActiveProxy,
		() => currentActiveProxy,
		() => currentActiveProxy,
	)

	return {
		activeProxy,
		// Flatten proxyType out of the activeProxy object so callers don't have to reach into it — most
		// components only need the type string, not the full record.
		activeProxyType: activeProxy?.proxyType || null,
	}
}
