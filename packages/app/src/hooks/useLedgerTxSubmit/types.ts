// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { FeedbackMessage } from 'contexts/LedgerHardware/types'
import type { ActiveAccount } from 'types'

export interface UseLedgerTxSubmitProps {
	uid: number
	submitted: boolean
	valid: boolean
	submitText?: string
	submitAccount: ActiveAccount
	onSubmit: () => void
	notEnoughFunds: boolean
}

export interface UseLedgerTxSubmitReturn {
	text: string
	icon: IconDefinition
	handleOnClick: () => void | Promise<void>
	disabled: boolean
	feedback: FeedbackMessage
	message: string
	runtimesInconsistent: boolean
}
