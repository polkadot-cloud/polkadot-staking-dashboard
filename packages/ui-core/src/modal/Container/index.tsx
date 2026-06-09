// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import commonClasses from '../../common.module.scss'
import type { ContainerProps } from '../types'
import classes from './index.module.scss'

export const Container = ({
	children,
	onClose,
	label = 'Dialog',
	closeLabel = 'Close',
	...rest
}: ContainerProps) => {
	const allClasses = classNames(commonClasses.fixed, classes.container)
	const dialogRef = useRef<HTMLDivElement>(null)

	// Move focus into the dialog on open and restore it to the previously
	// focused element (the trigger) when the dialog closes.
	useEffect(() => {
		const previouslyFocused = document.activeElement as HTMLElement | null
		dialogRef.current?.focus()
		return () => {
			previouslyFocused?.focus?.()
		}
	}, [])

	return (
		<motion.div className={allClasses} {...rest}>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-label={label}
				tabIndex={-1}
			>
				{children}
				<button
					type="button"
					className={classes.close}
					onClick={() => onClose()}
					aria-label={closeLabel}
					tabIndex={-1}
				>
					&nbsp;
				</button>
			</div>
		</motion.div>
	)
}
