// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { activeProxy$ } from '@polkadot-cloud/connect-proxies'
import { useEffect, useState } from 'react'
import type { ActiveProxy } from 'types'
import type { ActiveProxyHookInterface } from './types'

export const useActiveProxy = (): ActiveProxyHookInterface => {
	const [activeProxy, setActiveProxy] = useState<ActiveProxy | null>(null)

	// This hook is intentionally a thin wrapper around the activeProxy$ observable from
	// connect-proxies. Components subscribe directly to the global bus value here.
	useEffect(() => {
		const subscription = activeProxy$.subscribe((result) => {
			setActiveProxy(result)
		})
		return () => subscription.unsubscribe()
	}, [])

	return {
		activeProxy,
		// Flatten proxyType out of the activeProxy object so callers don't have to reach into it — most
		// components only need the type string, not the full record.
		activeProxyType: activeProxy?.proxyType || null,
	}
}
