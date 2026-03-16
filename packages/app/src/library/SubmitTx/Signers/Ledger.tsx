// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHelp } from 'contexts/Help'
import { useLedgerTxPrompt } from 'hooks/useLedgerTxPrompt'
import { useLedgerTxSubmit } from 'hooks/useLedgerTxSubmit'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SubmitButtonWrapper } from 'library/Tx/Wrapper'
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
}

interface LedgerPromptProps {
	valid: boolean
}

export const LedgerSubmit = ({
	uid,
	valid,
	submitted,
	submitText,
	submitAccount,
	onSubmit,
	notEnoughFunds,
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
		<SubmitButtonWrapper>
			<SubmitButton
				text={buttonText}
				icon={buttonIcon}
				iconTransform="shrink-3"
				onSubmit={buttonOnClick}
				disabled={buttonDisabled}
				pulse={buttonPulse}
				fee={<EstimatedTxFee uid={uid} />}
			/>
		</SubmitButtonWrapper>
	)
}

export const LedgerPrompt = ({ valid }: LedgerPromptProps) => {
	const { openHelpTooltip } = useHelp()
	const { feedback, message } = useLedgerTxPrompt()

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
