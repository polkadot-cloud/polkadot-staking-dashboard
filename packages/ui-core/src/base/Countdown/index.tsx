// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const Countdown = ({
	children,
	style,
	variant = 'primary',
}: ComponentBase & {
	variant?: 'primary' | 'secondary'
}) => (
	<span
		className={`${classes.countdown} ${variant ? classes[variant] : ''}`}
		style={style}
	>
		{children}
	</span>
)
