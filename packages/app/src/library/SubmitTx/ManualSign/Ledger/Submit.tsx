// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import type { DisplayFor } from 'types'
import { ButtonSubmit } from 'ui-buttons'

interface LedgerSubmitProps {
	displayFor?: DisplayFor
	icon: IconDefinition
	text: string
	onSubmit: () => void | Promise<void>
	disabled: boolean
}

export const Submit = ({
	displayFor,
	icon,
	text,
	onSubmit,
	disabled,
}: LedgerSubmitProps) => {
	return displayFor !== 'card' ? (
		<ButtonSubmit
			lg={displayFor === 'canvas'}
			iconLeft={icon}
			iconTransform="grow-2"
			text={text}
			onClick={onSubmit}
			disabled={disabled}
			pulse={!disabled}
		/>
	) : (
		<ButtonSubmitLarge
			disabled={disabled}
			onSubmit={onSubmit}
			submitText={text}
			icon={icon}
			pulse={!disabled}
		/>
	)
}
