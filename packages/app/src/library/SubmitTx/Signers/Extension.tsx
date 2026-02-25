// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SubmitButtonWrapper } from 'library/Tx/Wrapper'
import type { ReactNode } from 'react'
import type { DisplayFor } from 'types'

interface ExtensionProps {
	uid: number
	displayFor?: DisplayFor
	submitText: string
	onSubmit: () => void
	valid: boolean
	children?: ReactNode
}

export const Extension = ({
	uid,
	displayFor,
	submitText,
	onSubmit,
	valid,
	children,
}: ExtensionProps) => {
	const buttonDisabled = !valid

	const submitButton = (
		<SubmitButton
			displayFor={displayFor}
			text={submitText}
			icon={faArrowAltCircleUp}
			onSubmit={onSubmit}
			disabled={buttonDisabled}
			pulse={!buttonDisabled}
		/>
	)

	return (
		<>
			<SubmitButtonWrapper
				className={`${appendOrEmpty(displayFor === 'card', 'col')}`}
			>
				<EstimatedTxFee uid={uid} />
				<div>
					{children}
					{displayFor !== 'card' && submitButton}
				</div>
			</SubmitButtonWrapper>
			{displayFor === 'card' && submitButton}
		</>
	)
}
