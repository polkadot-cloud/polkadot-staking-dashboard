// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useSyncExternalStore } from 'react'
import type { TooltipHookInterface, TooltipHookState } from './types'

export type { TooltipHookInterface, TooltipHookState } from './types'

const defaultTooltipState: TooltipHookState = {
	open: 0,
	show: 0,
	position: [0, 0],
	text: '',
}

const listeners = new Set<() => void>()
let currentTooltipState: TooltipHookState = defaultTooltipState

const emitTooltipChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const subscribeTooltip = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const getTooltipSnapshot = () => currentTooltipState

const setTooltipState = (state: TooltipHookState) => {
	currentTooltipState = state
	emitTooltipChange()
}

export const useTooltip = (): TooltipHookInterface => {
	const state = useSyncExternalStore(
		subscribeTooltip,
		getTooltipSnapshot,
		getTooltipSnapshot,
	)

	const openTooltip = useCallback(() => {
		if (currentTooltipState.open) {
			return
		}
		setTooltipState({
			...currentTooltipState,
			open: 1,
		})
	}, [])

	const closeTooltip = useCallback(() => {
		setTooltipState({
			...currentTooltipState,
			open: 0,
			show: 0,
		})
	}, [])

	const setTooltipPosition = useCallback((x: number, y: number) => {
		setTooltipState({
			...currentTooltipState,
			open: currentTooltipState.open || 1,
			position: [x, y],
		})
	}, [])

	const showTooltip = useCallback(() => {
		setTooltipState({
			...currentTooltipState,
			show: 1,
		})
	}, [])

	const setTooltipTextAndOpen = useCallback((text: string) => {
		if (currentTooltipState.open) {
			return
		}
		setTooltipState({
			...currentTooltipState,
			open: 1,
			text,
		})
	}, [])

	return {
		openTooltip,
		closeTooltip,
		setTooltipPosition,
		showTooltip,
		setTooltipTextAndOpen,
		open: state.open,
		show: state.show,
		position: state.position,
		text: state.text,
	}
}
