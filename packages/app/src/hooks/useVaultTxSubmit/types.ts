// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SignerSubmitState } from 'library/SubmitTx/SignerSubmitState'

export interface UseVaultTxSubmitProps {
	submitted: boolean
	valid: boolean
	submitText?: string
	promptStatus: number
	disabled: boolean
}

export type UseVaultTxSubmitReturn = Pick<
	SignerSubmitState,
	'buttonText' | 'buttonDisabled' | 'buttonPulse'
>
