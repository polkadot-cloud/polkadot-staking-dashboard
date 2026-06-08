// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { activeProxy$ } from '@polkadot-cloud/connect-proxies'
import { useEffect, useState } from 'react'
import type { ActiveProxy } from 'types'
import type { ActiveProxyHookInterface } from './types'

export const useActiveProxy = (): ActiveProxyHookInterface => {
	const [activeProxy, setActiveProxy] = useState<ActiveProxy | null>(null)

	useEffect(() => {
		const subscription = activeProxy$.subscribe((result) => {
			setActiveProxy(result)
		})
		return () => subscription.unsubscribe()
	}, [])

	return {
		activeProxy,
		activeProxyType: activeProxy?.proxyType || null,
	}
}
