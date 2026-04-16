// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { ActiveAccount } from 'types'

export interface ActiveAccountsContextInterface {
	activeAccount: ActiveAccount
	activeAddress: MaybeString
	setActiveAccount: (
		account: ActiveAccount,
		updateLocalStorage?: boolean,
	) => void
}
