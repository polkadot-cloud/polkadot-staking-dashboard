// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerTxSubmit } from 'hooks/useLedgerTxSubmit'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import type { LedgerSubmitProps } from 'library/SubmitTx/types'
import { ButtonSubmit } from 'ui-buttons'

export const Submit = ({
	displayFor,
	submitted,
	submitText,
	onSubmit,
	disabled,
}: LedgerSubmitProps) => {
	const { text, icon, handleOnClick } = useLedgerTxSubmit({
		submitted,
		submitText,
		onSubmit,
		disabled,
	})

	return displayFor !== 'card' ? (
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
	)
}
