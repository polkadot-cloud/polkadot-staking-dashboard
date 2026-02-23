// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FeedbackMessage } from 'contexts/LedgerHardware/types'
import type { SignerSubmitState } from 'library/SubmitTx/SignerSubmitState'
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

export interface UseLedgerTxSubmitReturn extends SignerSubmitState {
	// Ledger always provides these, so override them to be non-optional
	feedback: FeedbackMessage
	message: string
	runtimesInconsistent: boolean
}
