// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type SignerOption = {
	address: string
	source: string
	proxyType: string | null // null when using non-proxied account directly
}

export interface UseProxySwitcher {
	currentProxy: SignerOption | null
	delegates: SignerOption[]
	currentIndex: number
	hasMultipleDelegates: boolean
	onNextProxy: () => void
	onPreviousProxy: () => void
}
