// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { ActiveAccount } from 'types'

export interface UseLedgerTxSubmitProps {
	uid: number
	submitted: boolean
	valid: boolean
	submitText?: string
	submitAccount: ActiveAccount
	onSubmit: () => void
	notEnoughFunds: boolean
	/** When false, all side effects are skipped and idle state is returned */
	enabled?: boolean
}

export interface UseLedgerTxSubmitReturn {
	/** Text displayed on the submit button */
	buttonText: string
	/** Icon displayed on the submit button */
	buttonIcon: IconDefinition
	/** Handler invoked when the submit button is clicked */
	buttonOnClick: () => void | Promise<void>
	/** Whether the submit button is disabled */
	buttonDisabled: boolean
	/** Whether the submit button should pulse */
	buttonPulse: boolean
}
