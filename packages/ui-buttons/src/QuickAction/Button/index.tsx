// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ButtonQuickActionProps } from '../../types'
import classes from './index.module.scss'

export const Button = ({
	onClick,
	label,
	disabled,
	Icon,
}: ButtonQuickActionProps) => {
	const buttonClasses = classNames(classes.btnQuickAction, {
		[classes.disabled]: disabled,
		[classes.active]: !disabled,
	})

	return (
		<div className={classes.container}>
			<button
				type="button"
				className={buttonClasses}
				onClick={onClick}
				disabled={disabled}
			>
				<span className={classes.icon}>
					<Icon />
				</span>
				<h4>{label}</h4>
			</button>
		</div>
	)
}

export const PreloadingButton = () => {
	const buttonClasses = classNames(classes.btnQuickAction, classes.preloading)
	return (
		<div className={buttonClasses}>
			<div className={classes.inner}></div>
		</div>
	)
}
