// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FeedbackMessage } from 'contexts/LedgerHardware/types'

export interface UseLedgerTxPromptReturn {
	/** Ledger loop feedback (message + helpKey) */
	feedback: FeedbackMessage
	/** Human-readable message to display below the fee estimate */
	message: string
}
