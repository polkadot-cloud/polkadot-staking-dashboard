// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface DeriveVaultButtonStateInput {
	submitted: boolean
	valid: boolean
	submitText: string
	signText: string
	promptStatus: number
	disabled: boolean
}

export interface DeriveVaultButtonStateOutput {
	buttonText: string
	buttonDisabled: boolean
	buttonPulse: boolean
}
