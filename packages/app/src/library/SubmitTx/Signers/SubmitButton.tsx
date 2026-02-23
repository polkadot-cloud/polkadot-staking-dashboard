// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit, ButtonSubmitLarge } from 'ui-buttons'
import type { SubmitButtonProps } from '../types'

export const SubmitButton = ({
	displayFor,
	text,
	icon,
	onSubmit,
	disabled,
	pulse,
	iconTransform = 'grow-2',
}: SubmitButtonProps) => {
	return displayFor !== 'card' ? (
		<ButtonSubmit
			lg={displayFor === 'canvas'}
			iconLeft={icon}
			iconTransform={iconTransform}
			text={text}
			onClick={() => onSubmit()}
			disabled={disabled}
			pulse={pulse}
		/>
	) : (
		<ButtonSubmitLarge
			disabled={disabled}
			onSubmit={() => onSubmit()}
			submitText={text}
			icon={icon}
			iconTransform={iconTransform}
			pulse={pulse}
		/>
	)
}
