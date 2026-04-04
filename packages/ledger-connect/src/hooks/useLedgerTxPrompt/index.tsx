// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerHardware } from '../../LedgerHardwareContext'
import { getLedgerDeviceName, isTouchscreenDevice } from '../../util'
import type { UseLedgerTxPromptReturn } from './types'

export const useLedgerTxPrompt = (): UseLedgerTxPromptReturn => {
	const { t, getFeedback, getDeviceModel, integrityChecked } =
		useLedgerHardware()

	const feedback = getFeedback()
	const deviceModel = getDeviceModel()
	const deviceName = getLedgerDeviceName(deviceModel)

	let message: string
	if (feedback?.message) {
		message = feedback.message
	} else if (!integrityChecked) {
		message =
			deviceModel !== 'unknown'
				? t('ledgerConnectAndConfirmDevice', { device: deviceName })
				: t('ledgerConnectAndConfirm')
	} else {
		const approvalText = isTouchscreenDevice(deviceModel)
			? t('ledgerApproveTouchscreen', { device: deviceName })
			: deviceModel !== 'unknown'
				? t('ledgerApproveNano', { device: deviceName })
				: t('submitTransaction')
		message = `${t('deviceVerified')}. ${approvalText}`
	}

	return { feedback, message }
}
