// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface UseVaultTxSubmitProps {
	submitted: boolean
	valid: boolean
	submitText?: string
	promptStatus: number
	disabled: boolean
}

export interface UseVaultTxSubmitReturn {
	/** Text displayed on the submit button */
	buttonText: string
	/** Whether the submit button is disabled */
	buttonDisabled: boolean
	/** Whether the submit button should pulse */
	buttonPulse: boolean
}
