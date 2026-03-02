// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerHardware } from 'contexts/LedgerHardware'
import { useTranslation } from 'react-i18next'
import type { UseLedgerTxPromptReturn } from './types'

export const useLedgerTxPrompt = (): UseLedgerTxPromptReturn => {
	const { t } = useTranslation('app')
	const { getFeedback, integrityChecked } = useLedgerHardware()

	const feedback = getFeedback()
	const message = feedback?.message
		? feedback.message
		: !integrityChecked
			? t('ledgerConnectAndConfirm')
			: `${t('deviceVerified')}. ${t('submitTransaction')}`

	return { feedback, message }
}
