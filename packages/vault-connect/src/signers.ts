// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
	DeriveVaultButtonStateInput,
	DeriveVaultButtonStateOutput,
} from './types'

/**
 * Pure function that derives Vault submit button visual state from inputs.
 * Extracted from useVaultTxSubmit for testability.
 */
export const deriveVaultButtonState = ({
	submitted,
	valid,
	submitText,
	signText,
	promptStatus,
	disabled,
}: DeriveVaultButtonStateInput): DeriveVaultButtonStateOutput => {
	if (submitted) {
		return {
			buttonText: submitText,
			buttonDisabled: disabled,
			buttonPulse: !(!valid || promptStatus !== 0),
		}
	}
	return {
		buttonText: signText,
		buttonDisabled: disabled || promptStatus !== 0,
		buttonPulse: !disabled || promptStatus === 0,
	}
}
