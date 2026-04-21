// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletProxyProxyDefinition } from '@dedot/chaintypes/substrate'

export type { PalletProxyProxyDefinition }

// Proxy storage query result tuple: [proxyDefinitions, deposit].
export type ProxyStateTuple = [PalletProxyProxyDefinition[], bigint]

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
