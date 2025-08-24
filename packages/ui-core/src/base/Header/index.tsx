// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from 'types'
import classes from './index.module.scss'

export const Header = ({
	children,
	style,
	className,
}: ComponentBaseWithClassName) => (
	<div className={`${classes.header} ${className}`} style={style}>
		{children}
	</div>
)
