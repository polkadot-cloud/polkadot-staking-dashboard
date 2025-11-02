// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { ButtonAccountStandaloneProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const Standalone = ({
	label,
	iconLeft,
	iconRight,
	className,
	marginLeft,
	style,
	onClick,
	onMouseOver,
	onMouseMove,
	onMouseOut,
	disabled,
}: ButtonAccountStandaloneProps) => {
	const allClasses = classNames(classes.btnAccount, {
		[classes.marginLeft]: marginLeft,
	})

	return (
		<button
			type="button"
			className={`${className ? `${className} ` : ' '}${allClasses}`}
			style={style}
			disabled={disabled}
			{...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
		>
			{iconLeft && (
				<span className={classes.notSignedIn}>
					<FontAwesomeIcon icon={iconLeft} transform="shrink-2" />
				</span>
			)}
			<span className={classes.display}>{label}</span>
			{iconRight && (
				<div className={classes.arrow}>
					<FontAwesomeIcon icon={iconRight} transform="shrink-5" />
				</div>
			)}
		</button>
	)
}
