// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import classes from './index.module.scss'
import type { SideProps } from './types'

export const Default = ({
	children,
	style,
	open,
	minimised,
}: SideProps) => {
	const classses = classNames(classes.side, classes.default, {
		[classes.hidden]: !open,
		[classes.minimised]: minimised,
	})

	return (
		<div style={{ ...style }} className={classses}>
			{children}
		</div>
	)
}
