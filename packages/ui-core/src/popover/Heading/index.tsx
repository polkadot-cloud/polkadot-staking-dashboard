// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CSSProperties, ReactNode } from 'react'
import classes from './index.module.scss'

export const Heading = ({
	children,
	style,
}: {
	children: ReactNode
	style?: CSSProperties
}) => (
	<div className={classes.heading} style={{ ...style }}>
		{children}
	</div>
)
