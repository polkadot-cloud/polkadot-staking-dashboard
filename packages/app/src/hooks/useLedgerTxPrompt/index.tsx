// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerHardware } from 'contexts/LedgerHardware'
import {
	getLedgerDeviceName,
	isTouchscreenDevice,
} from 'contexts/LedgerHardware/deviceModel'
import { useTranslation } from 'react-i18next'
import type { UseLedgerTxPromptReturn } from './types'

export const useLedgerTxPrompt = (): UseLedgerTxPromptReturn => {
	const { t } = useTranslation('app')
	const { getFeedback, integrityChecked, deviceModel } = useLedgerHardware()

	const feedback = getFeedback()

	let message: string
	if (feedback?.message) {
		message = feedback.message
	} else if (!integrityChecked) {
		message =
			deviceModel !== 'unknown'
				? t('ledgerConnectAndConfirmDevice', {
						device: getLedgerDeviceName(deviceModel),
					})
				: t('ledgerConnectAndConfirm')
	} else {
		const deviceName = getLedgerDeviceName(deviceModel)
		const approvalText = isTouchscreenDevice(deviceModel)
			? t('ledgerApproveTouchscreen', { device: deviceName })
			: deviceModel !== 'unknown'
				? t('ledgerApproveNano', { device: deviceName })
				: t('submitTransaction')
		message = `${t('deviceVerified')}. ${approvalText}`
	}

	return { feedback, message }
}
