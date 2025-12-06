// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveProxy } from 'types'

export interface UseProxySwitcher {
	currentProxy: ActiveProxy | null
	delegates: ActiveProxy[]
	currentIndex: number
	hasMultipleDelegates: boolean
	nextProxy: () => void
	previousProxy: () => void
}
