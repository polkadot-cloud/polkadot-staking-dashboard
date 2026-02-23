// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendOrEmpty } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import type { SignerSubmitState } from 'library/SubmitTx/SignerSubmitState'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SignerFeedback } from 'library/Tx/Wrapper'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { DisplayFor } from 'types'

interface SignerContentProps {
	uid: number
	displayFor?: DisplayFor
	valid: boolean
	signerState: SignerSubmitState
	children?: ReactNode
}

export const SignerContent = ({
	uid,
	displayFor,
	valid,
	signerState,
	children,
}: SignerContentProps) => {
	const { t } = useTranslation('app')
	const { openHelpTooltip } = useHelp()

	const {
		signerType,
		buttonText,
		buttonIcon,
		buttonOnClick,
		buttonDisabled,
		buttonPulse,
		feedback,
		message,
		runtimesInconsistent,
	} = signerState

	const submitButton = (
		<SubmitButton
			displayFor={displayFor}
			text={buttonText}
			icon={buttonIcon}
			onSubmit={buttonOnClick}
			disabled={buttonDisabled}
			pulse={buttonPulse}
		/>
	)

	switch (signerType) {
		case 'ledger':
			return (
				<>
					<EstimatedTxFee uid={uid} />
					{runtimesInconsistent && (
						<SignerFeedback>
							<p className="prompt">
								{t('ledgerAppOutOfDate')}
								<ButtonHelpTooltip
									definition="Ledger App Not on Latest Runtime Version"
									openHelp={openHelpTooltip}
								/>
							</p>
						</SignerFeedback>
					)}
					<div
						className={`inner msg${appendOrEmpty(displayFor === 'card', 'col')}`}
					>
						<div>
							{valid ? (
								<p className="prompt">
									<FontAwesomeIcon
										icon={faCircleExclamation}
										className="icon"
									/>
									{message}
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
							{children}
							{submitButton}
						</div>
					</div>
				</>
			)

		case 'vault':
			return (
				<div
					className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}
				>
					<EstimatedTxFee uid={uid} />
					<SignerFeedback>
						{valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
					</SignerFeedback>
					<div>
						{children}
						{submitButton}
					</div>
				</div>
			)

		default:
			// Extension
			return (
				<>
					<div
						className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}
					>
						<EstimatedTxFee uid={uid} />
						<div>
							{children}
							{displayFor !== 'card' && submitButton}
						</div>
					</div>
					{displayFor === 'card' && submitButton}
				</>
			)
	}
}
