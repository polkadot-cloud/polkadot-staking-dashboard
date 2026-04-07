// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useEffect } from 'react'
import { useLedger } from '../../LedgerContext'
import type { LedgerResponse } from '../../types'
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
	setModalResize,
	accountHasSigner,
}: UseLedgerTxSubmitProps): UseLedgerTxSubmitReturn => {
	const {
		setFeedbackCode,
		isExecuting,
		setStatusCode,
		handleUnmount,
		resetStatusCode,
		integrityChecked,
		transportResponse,
		checkRuntimeVersion,
	} = useLedger()

	// Handle new Ledger status report
	const handleLedgerStatusResponse = (response: LedgerResponse) => {
		if (!response) {
			return
		}
		const { ack, statusCode: newStatusCode, body } = response

		if (newStatusCode === 'SignedPayload') {
			if (uid !== body.uid) {
				// UIDs do not match, so this is not the transaction we are waiting for
				setFeedbackCode('wrongTransaction', 'Wrong Transaction')
			} else {
				setStatusCode({ ack, statusCode: newStatusCode })
			}
			// Reset state pertaining to this transaction
			resetStatusCode()
		} else {
			setStatusCode({ ack, statusCode: newStatusCode })
		}
	}

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
		[enabled],
	)

	// When disabled, return idle state
	if (!enabled) {
		return {
			buttonText: '',
			buttonIcon: faUsb,
			buttonOnClick: noop,
			buttonDisabled: true,
			buttonPulse: false,
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

	// Determine button text (returns translation codes for internally generated text)
	const buttonText = !integrityChecked
		? 'confirm'
		: txReady
			? submitText || ''
			: isExecuting
				? 'signing'
				: 'sign'

	// Button icon
	const buttonIcon = !integrityChecked ? faUsb : faSquarePen

	// Button pulse state
	const buttonPulse = !buttonDisabled

	return {
		buttonText,
		buttonIcon,
		buttonOnClick,
		buttonDisabled,
		buttonPulse,
	}
}
