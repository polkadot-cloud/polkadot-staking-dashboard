// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { activeProxy$ } from '@polkadot-cloud/connect-proxies'
import { createSafeContext } from '@w3ux/hooks'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { ActiveProxy } from 'types'
import type { ActiveProxyContextInterface } from './types'

export const [ActiveProxyContext, useActiveProxy] =
	createSafeContext<ActiveProxyContextInterface>()

export const ActiveProxyProvider = ({ children }: { children: ReactNode }) => {
	// Store the active proxy account
	const [activeProxy, setActiveProxy] = useState<ActiveProxy | null>(null)

	// Subscribe to global bus active proxy events
	useEffect(() => {
		const unsubActiveProxy = activeProxy$.subscribe((result) => {
			setActiveProxy(result)
		})
		return () => {
			unsubActiveProxy.unsubscribe()
		}
	}, [])

	return (
		<ActiveProxyContext.Provider
			value={{
				activeProxy,
				activeProxyType: activeProxy?.proxyType || null,
			}}
		>
			{children}
		</ActiveProxyContext.Provider>
	)
}
