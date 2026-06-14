// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useSyncExternalStore } from 'react'
import type { HelpHookInterface, HelpHookState } from './types'

export type { HelpHookInterface, HelpHookState } from './types'

const defaultHelpState: HelpHookState = {
	isTooltipOpen: false,
	tooltipDefinition: null,
	tooltipAnchor: null,
}

const listeners = new Set<() => void>()
let currentHelpState: HelpHookState = defaultHelpState

const emitHelpChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const subscribeHelp = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const getHelpSnapshot = () => currentHelpState

const setHelpState = (state: HelpHookState) => {
	currentHelpState = state
	emitHelpChange()
}

export const useHelp = (): HelpHookInterface => {
	const state = useSyncExternalStore(
		subscribeHelp,
		getHelpSnapshot,
		getHelpSnapshot,
	)

	const openHelpTooltip = useCallback(
		(definition: string | null, anchor: HTMLButtonElement | null) => {
			setHelpState({
				isTooltipOpen: true,
				tooltipDefinition: definition,
				tooltipAnchor: anchor,
			})
		},
		[],
	)

	const closeHelpTooltip = useCallback(() => {
		setHelpState(defaultHelpState)
	}, [])

	return {
		openHelpTooltip,
		closeHelpTooltip,
		isTooltipOpen: state.isTooltipOpen,
		tooltipDefinition: state.tooltipDefinition,
		tooltipAnchor: state.tooltipAnchor,
	}
}
