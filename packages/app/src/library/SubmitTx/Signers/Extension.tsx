// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { SubmitButton } from 'library/SubmitTx/Signers/SubmitButton'
import { SubmitButtonWrapper } from 'library/Tx/Wrapper'
import type { DisplayFor } from 'types'

interface ExtensionProps {
	uid: number
	displayFor?: DisplayFor
	submitText: string
	onSubmit: () => void
	valid: boolean
}

export const Extension = ({
	uid,
	submitText,
	onSubmit,
	valid,
}: ExtensionProps) => {
	const buttonDisabled = !valid

	return (
		<SubmitButtonWrapper>
			<SubmitButton
				text={submitText}
				onSubmit={onSubmit}
				disabled={buttonDisabled}
				pulse={!buttonDisabled}
				fee={<EstimatedTxFee uid={uid} />}
			/>
		</SubmitButtonWrapper>
	)
}
