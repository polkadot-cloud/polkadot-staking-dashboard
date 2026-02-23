// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import type { ReactNode } from 'react'
import type { SubmitProps } from '../types'

export const Extension = ({
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
	const { accountHasSigner } = useImportedAccounts()

	const disabled =
		submitted || !valid || !accountHasSigner(submitAccount) || notEnoughFunds

	const submitButton = (
		<SubmitButton
			displayFor={displayFor}
			text={submitText || ''}
			icon={faArrowAltCircleUp}
			onSubmit={onSubmit}
			disabled={disabled}
			pulse={!disabled}
		/>
	)

	return (
		<>
			<div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
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
