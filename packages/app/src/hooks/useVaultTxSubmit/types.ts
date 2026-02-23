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
	buttonText: string
	buttonDisabled: boolean
	buttonPulse: boolean
}
