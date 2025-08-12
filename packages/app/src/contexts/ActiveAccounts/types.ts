// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { ActiveAccount, ActiveProxy } from 'types'

export interface ActiveAccountsContextInterface {
	activeAccount: ActiveAccount
	activeAddress: MaybeString
	activeProxy: ActiveProxy | null
	activeProxyType: string | null
	setActiveAccount: (
		account: ActiveAccount,
		updateLocalStorage?: boolean,
	) => void
}
