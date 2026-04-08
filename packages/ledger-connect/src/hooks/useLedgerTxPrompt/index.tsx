// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedger } from '../../LedgerContext'
import { getLedgerDeviceName, isTouchscreenDevice } from '../../utils'
import type { UseLedgerTxPromptReturn } from './types'

export const useLedgerTxPrompt = (): UseLedgerTxPromptReturn => {
	const { getFeedbackCode, getDeviceModel, integrityChecked } = useLedger()

	const feedback = getFeedbackCode()
	const deviceModel = getDeviceModel()
	const deviceName = getLedgerDeviceName(deviceModel)

	let messageCode: string
	let messageParams: Record<string, string> | undefined
	let verified = false

	if (feedback?.message) {
		messageCode = feedback.message
		messageParams = { device: deviceName, ...feedback.params }
	} else if (!integrityChecked) {
		messageCode =
			deviceModel !== 'unknown'
				? 'ledgerConnectAndConfirmDevice'
				: 'ledgerConnectAndConfirm'
		messageParams = { device: deviceName }
	} else {
		verified = true
		messageCode = isTouchscreenDevice(deviceModel)
			? 'ledgerApproveTouchscreen'
			: deviceModel !== 'unknown'
				? 'ledgerApproveNano'
				: 'submitTransaction'
		messageParams = { device: deviceName }
	}

	return { feedback, messageCode, messageParams, verified }
}
