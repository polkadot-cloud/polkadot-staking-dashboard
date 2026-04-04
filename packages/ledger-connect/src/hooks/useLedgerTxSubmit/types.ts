// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { ActiveAccount } from '../../types'

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
	/** Callback to trigger modal resize - must be provided by the consuming app */
	setModalResize: () => void
	/** Function to check if an account has a signer - must be provided by the consuming app */
	accountHasSigner: (account: ActiveAccount) => boolean
}

export interface UseLedgerTxSubmitReturn {
	/** Ready-to-display submit button text (already translated) */
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
