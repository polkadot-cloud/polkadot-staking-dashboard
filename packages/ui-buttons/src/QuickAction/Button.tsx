// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { Loader } from 'ui-core/base'
import type { ButtonQuickActionProps } from '../types'
import classes from './index.module.scss'

export const Button = ({
	onClick,
	label,
	disabled,
	Icon,
}: ButtonQuickActionProps) => {
	const buttonClasses = classNames(classes.inner, {
		[classes.disabled]: disabled,
		[classes.active]: !disabled,
	})

	return (
		<div className={classes.button}>
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
	return (
		<Loader
			style={{
				width: '100%',
				height: '5.3rem',
				borderRadius: '0.85rem',
				marginBottom: '0.45rem',
			}}
		/>
	)
}
