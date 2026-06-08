// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { activeProxy$ } from '@polkadot-cloud/connect-proxies'
import { useSyncExternalStore } from 'react'
import type { ActiveProxy } from 'types'
import { createObservableStore } from '../util'
import type { ActiveProxyHookInterface } from './types'

const activeProxyStore = createObservableStore<ActiveProxy | null>(
	activeProxy$,
	null,
)

export const useActiveProxy = (): ActiveProxyHookInterface => {
	const activeProxy = useSyncExternalStore(
		activeProxyStore.subscribe,
		activeProxyStore.getSnapshot,
		activeProxyStore.getSnapshot,
	)

	return {
		activeProxy,
		// Flatten proxyType out of the activeProxy object so callers don't have to reach into it — most
		// components only need the type string, not the full record.
		activeProxyType: activeProxy?.proxyType || null,
	}
}
