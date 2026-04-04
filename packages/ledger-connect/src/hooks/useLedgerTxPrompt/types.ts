// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FeedbackMessage } from '../../types'

export interface UseLedgerTxPromptReturn {
	/** Ledger loop feedback (message + helpKey) */
	feedback: FeedbackMessage
	/** Ready-to-display prompt message (already translated) */
	message: string
}
