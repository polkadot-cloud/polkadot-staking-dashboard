// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import { deriveVaultButtonState } from 'utils'
import type { UseVaultTxSubmitProps, UseVaultTxSubmitReturn } from './types'

export const useVaultTxSubmit = ({
	submitted,
	valid,
	submitText,
	promptStatus,
	disabled,
}: UseVaultTxSubmitProps): UseVaultTxSubmitReturn => {
	const { t } = useTranslation('app')

	return deriveVaultButtonState({
		submitted,
		valid,
		submitText: submitText || '',
		signText: submitText || t('sign'),
		promptStatus,
		disabled,
	})
}
