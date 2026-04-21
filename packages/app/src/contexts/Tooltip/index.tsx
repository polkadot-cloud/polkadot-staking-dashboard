// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { TooltipContextInterface } from './types'

export const [TooltipContext, useTooltip] =
	createSafeContext<TooltipContextInterface>()

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState<number>(0)
	const [show, setShow] = useState<number>(0)
	const showRef = useRef(show)

	const [text, setText] = useState<string>('')
	const [position, setPosition] = useState<[number, number]>([0, 0])

	// Uses functional setState to avoid stale closure — stable reference.
	const openTooltip = useCallback(() => {
		setOpen((prev) => (prev ? prev : 1))
	}, [])

	// Stable — only calls setters with no state reads.
	const closeTooltip = useCallback(() => {
		setStateWithRef(0, setShow, showRef)
		setOpen(0)
	}, [])

	// Stable — position setter + functional open guard.
	const setTooltipPosition = useCallback((x: number, y: number) => {
		setPosition([x, y])
		setOpen((prev) => (prev ? prev : 1))
	}, [])

	// Stable — only calls setter with no state reads.
	const showTooltip = useCallback(() => {
		setStateWithRef(1, setShow, showRef)
	}, [])

	// Re-creates only when open changes (i.e. at most twice per tooltip lifecycle).
	const setTooltipTextAndOpen = useCallback(
		(t: string) => {
			if (open) {
				return
			}
			setText(t)
			setOpen(1)
		},
		[open],
	)

	const value = useMemo(
		() => ({
			openTooltip,
			closeTooltip,
			setTooltipPosition,
			showTooltip,
			setTooltipTextAndOpen,
			open,
			show: showRef.current,
			position,
			text,
		}),
		[
			openTooltip,
			closeTooltip,
			setTooltipPosition,
			showTooltip,
			setTooltipTextAndOpen,
			open,
			position,
			text,
		],
	)

	return (
		<TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
	)
}
