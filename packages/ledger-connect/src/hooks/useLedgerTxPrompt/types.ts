// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FeedbackMessage } from '../../types'

export interface UseLedgerTxPromptReturn {
	/** Ledger loop feedback (message + helpKey) */
	feedback: FeedbackMessage
	/** Translation code for the prompt message */
	messageCode: string
	/** Parameters for the translation code (e.g. device name) */
	messageParams?: Record<string, string>
	/** Whether the device has been verified. When true, consumers should
	 *  prepend a 'deviceVerified' translation before the main message. */
	verified: boolean
}
