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

export const useLedgerTxSubmit = ({
	uid,
	submitted,
	valid,
	submitText,
	submitAccount,
	onSubmit,
	notEnoughFunds,
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
	const disabled =
		!accountHasSigner(submitAccount) ||
		!valid ||
		submitted ||
		notEnoughFunds ||
		isExecuting

	// Resize modal on content change
	useEffect(() => {
		setModalResize()
	}, [integrityChecked, valid, submitted, notEnoughFunds, isExecuting])

	// Listen for new Ledger status reports
	useEffectIgnoreInitial(() => {
		handleLedgerStatusResponse(transportResponse)
	}, [transportResponse])

	// Tidy up context state when this component is no longer mounted
	useEffect(
		() => () => {
			handleUnmount()
		},
		[handleUnmount],
	)

	// Check device runtime version
	const handleCheckRuntimeVersion = async () => {
		await checkRuntimeVersion()
	}

	// Is the transaction ready to be submitted?
	const txReady = integrityChecked || submitted

	// Button `onClick` handler depends whether integrityChecked and whether tx has been submitted
	const handleOnClick = !integrityChecked ? handleCheckRuntimeVersion : onSubmit

	// Determine button text
	const text = !integrityChecked
		? t('confirm')
		: txReady
			? submitText || ''
			: isExecuting
				? t('signing')
				: t('sign')

	// Button icon
	const icon = !integrityChecked ? faUsb : faSquarePen

	// Determine message text
	const message = feedback?.message
		? feedback.message
		: !integrityChecked
			? t('ledgerConnectAndConfirm')
			: `${t('deviceVerified')}. ${t('submitTransaction')}`

	return {
		text,
		icon,
		handleOnClick,
		disabled,
		feedback,
		message,
		runtimesInconsistent,
	}
}
