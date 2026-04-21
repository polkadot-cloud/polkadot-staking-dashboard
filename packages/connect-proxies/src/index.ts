// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Constants
export { ActiveProxiesKey, SupportedProxies } from './consts'
// Controller (for consumers that manage lifecycle directly)
export { ProxyDiscoveryController } from './controller/ProxyDiscoveryController'
export { useActiveProxy } from './hooks/useActiveProxy'
// Hooks
export { useProxies } from './hooks/useProxies'
// Adaptor — pass ProxiesProvider to ConnectProvider.adaptors
export { ProxiesProvider } from './Provider'

// Persistence helpers
export {
	getLocalActiveProxies,
	getLocalActiveProxy,
	removeLocalActiveProxy,
	setLocalActiveProxy,
} from './persistence/activeProxy'
// One-shot query
export { queryProxies } from './query/proxies'
export {
	activeProxy$,
	getActiveProxy,
	resetActiveProxy,
	setActiveProxy,
} from './state/activeProxy'
// State observables (for consumers that prefer reactive access)
export {
	addProxies,
	getProxies,
	proxies$,
	removeProxies,
	resetProxies,
} from './state/proxies'
// Chain subscription class
export { ProxiesQuery } from './subscribe/ProxiesQuery'
// Types
export type {
	ActiveProxy,
	LocalActiveProxies,
	NetworkId,
	ProxyRecord,
	StakingChain,
} from './types'
// Utility predicates
export { isSupportedProxy, isSupportedProxyCall } from './utils/proxies'
