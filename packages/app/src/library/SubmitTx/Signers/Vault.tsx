// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { useVaultTxSubmit } from 'hooks/useVaultTxSubmit'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SubmitButtonWrapper } from 'library/Tx/Wrapper'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { DisplayFor } from 'types'

interface VaultProps {
	uid: number
	displayFor?: DisplayFor
	valid: boolean
	submitted: boolean
	submitText?: string
	onSubmit: () => void
	notEnoughFunds: boolean
	promptStatus: number
	children?: ReactNode
}

export const VaultSubmit = ({
	uid,
	displayFor,
	valid,
	submitted,
	submitText,
	onSubmit,
	notEnoughFunds,
	promptStatus,
	children,
}: VaultProps) => {
	const { buttonText, buttonDisabled, buttonPulse } = useVaultTxSubmit({
		submitted,
		valid,
		submitText,
		promptStatus,
		disabled: submitted || !valid || notEnoughFunds,
	})

	// For card displayFor, override disabled/pulse logic
	const isCard = displayFor === 'card'
	const finalDisabled = isCard
		? submitted || !valid || notEnoughFunds
		: buttonDisabled
	const finalPulse = isCard ? !finalDisabled : buttonPulse

	return (
		<>
			<EstimatedTxFee uid={uid} />
			<SubmitButtonWrapper
				className={`${appendOrEmpty(displayFor === 'card', 'col')}`}
			>
				<div>
					{children}
					<SubmitButton
						displayFor={displayFor}
						text={buttonText}
						icon={faSquarePen}
						onSubmit={onSubmit}
						disabled={finalDisabled}
						pulse={finalPulse}
					/>
				</div>
			</SubmitButtonWrapper>
		</>
	)
}

export const VaultPrompt = ({ valid }: { valid: boolean }) => {
	const { t } = useTranslation('app')
	return (
		<>
			{valid ? (
				<p className="prompt">{t('submitTransaction')}</p>
			) : (
				<p className="prompt">...</p>
			)}
		</>
	)
}
