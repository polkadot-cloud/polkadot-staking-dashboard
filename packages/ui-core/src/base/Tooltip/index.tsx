// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { Tooltip as RadixTooltip } from 'radix-ui'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import classes from './index.module.scss'

export const Tooltip = ({
	children,
	container,
	text,
	onTriggerClick,
	side = undefined,
	onPointerDownOutside,
	handleOpenChange,
	delayDuration = 200,
	fadeIn = false,
}: {
	children: ReactNode
	container?: HTMLDivElement
	text: string
	side?: 'top' | 'right' | 'bottom' | 'left'
	onTriggerClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
	onPointerDownOutside?: (e: Event) => void
	handleOpenChange?: (isOpen: boolean) => void
	delayDuration?: number
	fadeIn?: boolean
}) => {
	const contentClasses = classNames(classes.Content, {
		[classes.FadeIn]: fadeIn,
	})

	return (
		<RadixTooltip.Root
			onOpenChange={handleOpenChange}
			delayDuration={delayDuration}
		>
			<RadixTooltip.Trigger
				asChild
				onClick={(event) => {
					event.preventDefault()
					if (typeof onTriggerClick === 'function') {
						onTriggerClick(event)
					}
				}}
			>
				{children}
			</RadixTooltip.Trigger>
			<RadixTooltip.Portal container={container}>
				<RadixTooltip.Content
					className={contentClasses}
					sideOffset={5}
					side={side}
					onPointerDownOutside={(event) => {
						if (typeof onPointerDownOutside === 'function') {
							onPointerDownOutside(event)
						}
						event.preventDefault()
					}}
					onFocusCapture={(event) => {
						event.preventDefault()
					}}
				>
					{text}
					<RadixTooltip.Arrow className={classes.Arrow} />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	)
}
