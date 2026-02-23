// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { FeedbackMessage } from 'contexts/LedgerHardware/types'

/**
 * Common state shape returned by all signer submit hooks. Every signer hook
 * (Extension, Ledger, Vault) and the unified `useSignerSubmit` facade must
 * conform to at least the required fields of this interface.
 */
export interface SignerSubmitState {
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

	// Ledger-specific optional fields

	/** Ledger loop feedback (message + helpKey) */
	feedback?: FeedbackMessage
	/** Human-readable message to display below the fee estimate */
	message?: string
	/** Whether Ledger app runtime version is inconsistent with chain */
	runtimesInconsistent?: boolean
}
