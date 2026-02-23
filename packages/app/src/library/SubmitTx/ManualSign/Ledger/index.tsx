// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendOrEmpty } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { useLedgerTxSubmit } from 'hooks/useLedgerTxSubmit'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import { SignerFeedback } from 'library/Tx/Wrapper'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import type { SubmitProps } from '../../types'

export const Ledger = ({
	uid,
	onSubmit,
	submitted,
	valid,
	submitText,
	submitAccount,
	displayFor,
	notEnoughFunds,
	children,
}: SubmitProps & {
	children?: ReactNode
	notEnoughFunds: boolean
	submitted: boolean
}) => {
	const { t } = useTranslation('app')
	const { openHelpTooltip } = useHelp()

	const {
		disabled,
		feedback,
		runtimesInconsistent,
		integrityChecked,
		text,
		icon,
		handleOnClick,
	} = useLedgerTxSubmit({
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
							<FontAwesomeIcon icon={faCircleExclamation} className="icon" />
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
					{children}
					{displayFor !== 'card' ? (
						<ButtonSubmit
							lg={displayFor === 'canvas'}
							iconLeft={icon}
							iconTransform="grow-2"
							text={text}
							onClick={handleOnClick}
							disabled={disabled}
							pulse={!disabled}
						/>
					) : (
						<ButtonSubmitLarge
							disabled={disabled}
							onSubmit={handleOnClick}
							submitText={text}
							icon={icon}
							pulse={!disabled}
						/>
					)}
				</div>
			</div>
		</>
	)
}
