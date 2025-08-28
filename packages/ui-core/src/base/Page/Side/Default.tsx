// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import classes from './index.module.scss'
import type { SideProps } from './types'

export const Default = ({
	style,
	open,
	minimised,
	nav,
	advanced,
}: SideProps) => {
	const classses = classNames(classes.nav, classes.default, {
		[classes.hidden]: !open,
		[classes.minimised]: minimised,
	})

	return (
		<div className={classes.container}>
			{advanced && <div className={classes.advanced}>{advanced}</div>}
			<div style={{ ...style }} className={classses}>
				{nav}
			</div>
		</div>
	)
}
