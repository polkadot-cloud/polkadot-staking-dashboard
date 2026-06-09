// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveProxy } from 'types'

export interface ActiveProxyContextInterface {
	activeProxy: ActiveProxy | null
	activeProxyType: string | null
}
