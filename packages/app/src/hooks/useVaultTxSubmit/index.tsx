// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import type { UseVaultTxSubmitProps, UseVaultTxSubmitReturn } from './types'

export const useVaultTxSubmit = ({
	submitted,
	valid,
	submitText,
	promptStatus,
	disabled,
}: UseVaultTxSubmitProps): UseVaultTxSubmitReturn => {
	const { t } = useTranslation('app')

	// Format submit button based on whether signature currently exists or submission is ongoing
	let buttonText: string
	let buttonDisabled: boolean
	let buttonPulse: boolean

	if (submitted) {
		buttonText = submitText || ''
		buttonDisabled = disabled
		buttonPulse = !(!valid || promptStatus !== 0)
	} else {
		buttonText = t('sign')
		buttonDisabled = disabled || promptStatus !== 0
		buttonPulse = !disabled || promptStatus === 0
	}

	return {
		buttonText,
		buttonDisabled,
		buttonPulse,
	}
}
