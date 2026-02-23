// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { usePrompt } from 'contexts/Prompt'
import { useVaultTxSubmit } from 'hooks/useVaultTxSubmit'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SignerFeedback } from 'library/Tx/Wrapper'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitProps } from '../types'

export const Vault = ({
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
	const { status: promptStatus } = usePrompt()
	const { accountHasSigner } = useImportedAccounts()

	// The state under which submission is disabled.
	const disabled =
		submitted || !valid || !accountHasSigner(submitAccount) || notEnoughFunds

	// Get button state from hook
	const { buttonText, buttonDisabled, buttonPulse } = useVaultTxSubmit({
		submitted,
		valid,
		submitText,
		promptStatus,
		disabled,
	})

	return (
		<div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
			<EstimatedTxFee uid={uid} />
			<SignerFeedback>
				{valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
			</SignerFeedback>
			<div>
				{children}
				<SubmitButton
					displayFor={displayFor}
					text={buttonText}
					icon={faSquarePen}
					onSubmit={onSubmit}
					disabled={displayFor === 'card' ? disabled : buttonDisabled}
					pulse={displayFor === 'card' ? !disabled : buttonPulse}
				/>
			</div>
		</div>
	)
}
