// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveAccount, DisplayFor } from 'types'

export interface UseSignerSubmitProps {
	uid: number
	onSubmit: () => void
	submitted: boolean
	valid: boolean
	submitText?: string
	submitAccount: ActiveAccount
	displayFor?: DisplayFor
	notEnoughFunds: boolean
}
