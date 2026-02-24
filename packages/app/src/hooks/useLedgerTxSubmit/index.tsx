// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import type { LedgerResponse } from 'contexts/LedgerHardware/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import type { UseLedgerTxSubmitProps, UseLedgerTxSubmitReturn } from './types'

// No-op handler used when the hook is disabled
const noop = () => {}

export const useLedgerTxSubmit = ({
	uid,
	submitted,
	valid,
	submitText,
	submitAccount,
	onSubmit,
	notEnoughFunds,
	enabled = true,
}: UseLedgerTxSubmitProps): UseLedgerTxSubmitReturn => {
	const { t } = useTranslation('app')
	const {
		statusCode,
		setFeedback,
		getFeedback,
		isExecuting,
		setStatusCode,
		handleUnmount,
		resetStatusCode,
		integrityChecked,
		transportResponse,
		runtimesInconsistent,
		checkRuntimeVersion,
	} = useLedgerHardware()
	const { setModalResize } = useOverlay().modal
	const { accountHasSigner } = useImportedAccounts()

	// Handle new Ledger status report
	const handleLedgerStatusResponse = (response: LedgerResponse) => {
		if (!response) {
			return
		}
		const { ack, statusCode: newStatusCode, body } = response

		if (newStatusCode === 'SignedPayload') {
			if (uid !== body.uid) {
				// UIDs do not match, so this is not the transaction we are waiting for
				setFeedback(t('wrongTransaction'), 'Wrong Transaction')
			} else {
				setStatusCode({ ack, statusCode: newStatusCode })
			}
			// Reset state pertaining to this transaction
			resetStatusCode()
		} else {
			setStatusCode({ ack, statusCode: newStatusCode })
		}
	}

	// Get the latest Ledger loop feedback
	const feedback = getFeedback()

	// The state under which submission is disabled
	const buttonDisabled =
		!accountHasSigner(submitAccount) ||
		!valid ||
		submitted ||
		notEnoughFunds ||
		isExecuting

	// Resize modal on content change (guarded by enabled)
	useEffect(() => {
		if (!enabled) {
			return
		}
		setModalResize()
	}, [integrityChecked, valid, submitted, notEnoughFunds, isExecuting])

	// Listen for new Ledger status reports (guarded by enabled)
	useEffectIgnoreInitial(() => {
		if (!enabled) {
			return
		}
		handleLedgerStatusResponse(transportResponse)
	}, [enabled, transportResponse])

	// Tidy up context state when this component is no longer mounted (guarded by enabled)
	useEffect(
		() => () => {
			if (enabled) {
				handleUnmount()
			}
		},
		[enabled, handleUnmount],
	)

	// When disabled, return idle state
	if (!enabled) {
		return {
			signerType: 'ledger',
			buttonText: '',
			buttonIcon: faUsb,
			buttonOnClick: noop,
			buttonDisabled: true,
			buttonPulse: false,
			feedback: { message: '', helpKey: undefined },
			message: '',
			runtimesInconsistent: false,
		}
	}

	// Check device runtime version
	const handleCheckRuntimeVersion = async () => {
		await checkRuntimeVersion()
	}

	// Is the transaction ready to be submitted?
	const txReady = integrityChecked || submitted

	// Button `onClick` handler depends whether integrityChecked and whether tx has been submitted
	const buttonOnClick = !integrityChecked ? handleCheckRuntimeVersion : onSubmit

	// Determine button text
	const buttonText = !integrityChecked
		? t('confirm')
		: txReady
			? submitText || ''
			: isExecuting
				? t('signing')
				: t('sign')

	// Button icon
	const buttonIcon = !integrityChecked ? faUsb : faSquarePen

	// Button pulse state
	const buttonPulse = !buttonDisabled

	// Determine message text
	const message = feedback?.message
		? feedback.message
		: !integrityChecked
			? t('ledgerConnectAndConfirm')
			: `${t('deviceVerified')}. ${t('submitTransaction')}`

	return {
		signerType: 'ledger',
		buttonText,
		buttonIcon,
		buttonOnClick,
		buttonDisabled,
		buttonPulse,
		feedback,
		message,
		runtimesInconsistent,
	}
}
