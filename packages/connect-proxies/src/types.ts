// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaAssetHubApi } from '@dedot/chaintypes/kusama-asset-hub'
import type { PaseoAssetHubApi } from '@dedot/chaintypes/paseo-asset-hub'
import type { PolkadotAssetHubApi } from '@dedot/chaintypes/polkadot-asset-hub'
import type { WestendAssetHubApi } from '@dedot/chaintypes/westend-asset-hub'

// Chains that support the proxy pallet and staking queries
export type StakingChain =
	| PolkadotAssetHubApi
	| KusamaAssetHubApi
	| WestendAssetHubApi
	| PaseoAssetHubApi

// Supported relay network identifiers
export type NetworkId = 'polkadot' | 'kusama' | 'westend' | 'paseo'

// On-chain proxy data for a single delegator address
export type ProxyRecord = {
	proxies: {
		delegate: string
		proxyType: string
		delay: number
	}[]
	deposit: bigint
}

// Currently active proxy account
export type ActiveProxy = {
	address: string
	source: string
	proxyType: string
}

// localStorage shape: network → active proxy
export type LocalActiveProxies = Record<string, ActiveProxy>
