// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, type ReactNode, useContext, useRef } from 'react'
import { ProxyDiscoveryController } from './controller/ProxyDiscoveryController'

interface ProxiesContextValue {
	controller: ProxyDiscoveryController
}

const ProxiesContext = createContext<ProxiesContextValue | null>(null)

export const useProxiesContext = () => {
	const ctx = useContext(ProxiesContext)
	if (!ctx) {
		throw new Error('useProxiesContext must be used within ProxiesProvider')
	}
	return ctx
}

// Passive adaptor provider — creates a shared ProxyDiscoveryController and
// makes it available via context. No subscriptions are started here; they
// begin lazily when a consumer calls useProxies() with a valid API client.
export const ProxiesProvider = ({ children }: { children: ReactNode }) => {
	const controllerRef = useRef(new ProxyDiscoveryController())

	return (
		<ProxiesContext.Provider value={{ controller: controllerRef.current }}>
			{children}
		</ProxiesContext.Provider>
	)
}
