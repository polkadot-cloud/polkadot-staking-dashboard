// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendOrEmpty } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { useLedgerTxSubmit } from 'hooks/useLedgerTxSubmit'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import type { ReactNode } from 'react'
import type { ActiveAccount, DisplayFor } from 'types'

interface LedgerProps {
	uid: number
	displayFor?: DisplayFor
	valid: boolean
	submitted: boolean
	submitText?: string
	submitAccount: ActiveAccount
	onSubmit: () => void
	notEnoughFunds: boolean
	children?: ReactNode
}

export const LedgerSubmit = ({
	uid,
	displayFor,
	valid,
	submitted,
	submitText,
	submitAccount,
	onSubmit,
	notEnoughFunds,
	children,
}: LedgerProps) => {
	const { buttonText, buttonIcon, buttonOnClick, buttonDisabled, buttonPulse } =
		useLedgerTxSubmit({
			uid,
			submitted,
			valid,
			submitText,
			submitAccount,
			onSubmit,
			notEnoughFunds,
		})

	return (
		<>
			<EstimatedTxFee uid={uid} />
			<div
				className={`inner msg${appendOrEmpty(displayFor === 'card', 'col')}`}
			>
				<div>
					{children}
					<SubmitButton
						displayFor={displayFor}
						text={buttonText}
						icon={buttonIcon}
						onSubmit={buttonOnClick}
						disabled={buttonDisabled}
						pulse={buttonPulse}
					/>
				</div>
			</div>
		</>
	)
}

export const LedgerPrompt = ({
	uid,
	valid,
	submitted,
	submitText,
	submitAccount,
	onSubmit,
	notEnoughFunds,
}: LedgerProps) => {
	const { openHelpTooltip } = useHelp()
	const { feedback, message } = useLedgerTxSubmit({
		uid,
		submitted,
		valid,
		submitText,
		submitAccount,
		onSubmit,
		notEnoughFunds,
	})

	if (!valid) {
		return <p className="prompt">...</p>
	}

	return (
		<p className="prompt">
			<FontAwesomeIcon icon={faCircleExclamation} className="icon" />
			{message}
			{feedback?.helpKey && (
				<ButtonHelpTooltip
					marginLeft
					definition={feedback?.helpKey}
					openHelp={openHelpTooltip}
				/>
			)}
		</p>
	)
}
