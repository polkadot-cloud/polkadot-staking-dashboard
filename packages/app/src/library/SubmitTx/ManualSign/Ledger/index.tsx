// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { appendOrEmpty } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { getLedgerDeviceIcon } from 'contexts/LedgerHardware/icons'
import type { LedgerResponse } from 'contexts/LedgerHardware/types'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import type { SubmitProps } from '../../types'
import { Submit } from './Submit'

export const Ledger = ({
	uid,
	onSubmit,
	submitted,
	valid,
	submitText,
	buttons,
	submitAccount,
	displayFor,
	notEnoughFunds,
}: SubmitProps & {
	buttons?: ReactNode[]
	notEnoughFunds: boolean
	submitted: boolean
}) => {
	const { t } = useTranslation('app')
	const {
		deviceModel,
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
	} = useLedgerHardware()
	const { openHelpTooltip } = useHelp()
	const { setModalResize } = useOverlay().modal
	const { accountHasSigner } = useImportedAccounts()

	// Handle new Ledger status report.
	const handleLedgerStatusResponse = (response: LedgerResponse) => {
		if (!response) {
			return
		}
		const { ack, statusCode: newStatusCode, body } = response

		if (newStatusCode === 'SignedPayload') {
			if (uid !== body.uid) {
				// UIDs do not match, so this is not the transaction we are waiting for.
				setFeedback(t('wrongTransaction'), 'Wrong Transaction')
			} else {
				setStatusCode({ ack, statusCode: newStatusCode })
			}
			// Reset state pertaining to this transaction.
			resetStatusCode()
		} else {
			setStatusCode({ ack, statusCode: newStatusCode })
		}
	}

	// Get the latest Ledger loop feedback.
	const feedback = getFeedback()

	// The state under which submission is disabled.
	const disabled =
		!accountHasSigner(submitAccount) ||
		!valid ||
		submitted ||
		notEnoughFunds ||
		isExecuting

	// Resize modal on content change.
	useEffect(() => {
		setModalResize()
	}, [
		integrityChecked,
		valid,
		submitted,
		notEnoughFunds,
		statusCode,
		isExecuting,
	])

	// Listen for new Ledger status reports.
	useEffectIgnoreInitial(() => {
		handleLedgerStatusResponse(transportResponse)
	}, [transportResponse])

	// Tidy up context state when this component is no longer mounted.
	useEffect(
		() => () => {
			handleUnmount()
		},
		[],
	)

	// Resolve device-specific icon (falls back to generic Ledger logo)
	const DeviceIcon = getLedgerDeviceIcon(deviceModel)

	return (
		<>
			<div>
				<EstimatedTxFee uid={uid} />
			</div>
			{runtimesInconsistent && (
				<div className="inner warning">
					<div>
						<p className="prompt">
							{t('ledgerAppOutOfDate')}
							<ButtonHelpTooltip
								definition="Ledger App Not on Latest Runtime Version"
								openHelp={openHelpTooltip}
							/>
						</p>
					</div>
				</div>
			)}
			<div
				className={`inner msg${appendOrEmpty(displayFor === 'card', 'col')}`}
			>
				<div>
					{valid ? (
						<p className="prompt">
							<FontAwesomeIcon icon={faCircleExclamation} className="icon" />
							{deviceModel !== 'unknown' && (
								<DeviceIcon
									style={{
										width: '1.2rem',
										height: '1.2rem',
										marginRight: '0.4rem',
										verticalAlign: 'middle',
									}}
								/>
							)}
							{feedback?.message
								? feedback.message
								: !integrityChecked
									? t('ledgerConnectAndConfirm')
									: `${t('deviceVerified')}. ${t('submitTransaction')}`}
							{feedback?.helpKey && (
								<ButtonHelpTooltip
									marginLeft
									definition={feedback?.helpKey}
									openHelp={openHelpTooltip}
								/>
							)}
						</p>
					) : (
						<p className="prompt">...</p>
					)}
				</div>
				<div>
					{buttons}
					<Submit
						displayFor={displayFor}
						submitted={submitted}
						submitText={submitText}
						onSubmit={onSubmit}
						disabled={disabled}
					/>
				</div>
			</div>
		</>
	)
}
