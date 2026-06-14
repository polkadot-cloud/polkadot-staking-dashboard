// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, localStorageOrDefault } from '@w3ux/utils'
import { AdvancedModeKey, PageWidthMediumThreshold, ShowHelpKey } from 'consts'
import { useSyncExternalStore } from 'react'
import type { UiHookInterface } from './types'

export type { UiHookInterface } from './types'

const SideMenuMinimisedKey = 'side_menu_minimised'
const defaultAdvancedMode = false
const defaultShowHelp = true

type UiState = Omit<
	UiHookInterface,
	| 'setSideMenu'
	| 'setUserSideMenuMinimised'
	| 'setContainerRefs'
	| 'setAdvancedMode'
	| 'setShowHelp'
>

const hasWindow = () => typeof window !== 'undefined'
const hasLocalStorage = () => typeof localStorage !== 'undefined'

const getInitialAdvancedMode = (): boolean => {
	if (!hasLocalStorage()) {
		return defaultAdvancedMode
	}
	try {
		const urlMode = hasWindow() ? extractUrlValue('m') : null
		const localOrDefault = localStorageOrDefault(
			AdvancedModeKey,
			defaultAdvancedMode,
			true,
		) as boolean

		if (urlMode && ['simple', 'advanced'].includes(urlMode)) {
			const isAdvancedMode = urlMode === 'advanced'
			localStorage.setItem(AdvancedModeKey, String(isAdvancedMode))
			return isAdvancedMode
		}
		return localOrDefault
	} catch {
		localStorage.setItem(AdvancedModeKey, String(defaultAdvancedMode))
		return defaultAdvancedMode
	}
}

const getInitialShowHelp = (): boolean => {
	if (!hasLocalStorage()) {
		return defaultShowHelp
	}
	try {
		return localStorageOrDefault(ShowHelpKey, defaultShowHelp, true) as boolean
	} catch {
		localStorage.setItem(ShowHelpKey, String(defaultShowHelp))
		return defaultShowHelp
	}
}

const getInitialUserSideMenuMinimised = (): boolean => {
	if (!hasLocalStorage()) {
		return false
	}
	return localStorageOrDefault(SideMenuMinimisedKey, false, true) as boolean
}

const getResponsiveSideMenuMinimised = (userSideMenuMinimised: boolean) => {
	if (!hasWindow()) {
		return userSideMenuMinimised
	}
	return window.innerWidth <= PageWidthMediumThreshold
		? false
		: userSideMenuMinimised
}

const getInitialUiState = (): UiState => {
	const userSideMenuMinimised = getInitialUserSideMenuMinimised()
	return {
		sideMenuOpen: false,
		userSideMenuMinimised,
		sideMenuMinimised: getResponsiveSideMenuMinimised(userSideMenuMinimised),
		containerRefs: {},
		isBraveBrowser: false,
		advancedMode: getInitialAdvancedMode(),
		showHelp: getInitialShowHelp(),
	}
}

const listeners = new Set<() => void>()
let currentUiState: UiState = getInitialUiState()
let resizeListenerAttached = false
let braveDetectionStarted = false

const emitUiChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const getUiSnapshot = () => currentUiState

const setUiState = (next: Partial<UiState>) => {
	currentUiState = {
		...currentUiState,
		...next,
	}
	emitUiChange()
}

const resizeCallback = () => {
	setUiState({
		sideMenuMinimised: getResponsiveSideMenuMinimised(
			currentUiState.userSideMenuMinimised,
		),
	})
}

const detectBraveBrowser = () => {
	if (!hasWindow() || braveDetectionStarted) {
		return
	}
	braveDetectionStarted = true
	const maybeNavigator = window.navigator as Navigator & {
		brave?: { isBrave?: () => Promise<boolean> }
	}
	void maybeNavigator.brave?.isBrave?.().then((isBrave) => {
		setUiState({ isBraveBrowser: isBrave })
	})
}

const attachUiListeners = () => {
	detectBraveBrowser()
	if (!hasWindow() || resizeListenerAttached) {
		return
	}
	window.addEventListener('resize', resizeCallback)
	resizeListenerAttached = true
}

const detachUiListeners = () => {
	if (!hasWindow() || !resizeListenerAttached) {
		return
	}
	window.removeEventListener('resize', resizeCallback)
	resizeListenerAttached = false
}

const subscribeUi = (listener: () => void) => {
	if (listeners.size === 0) {
		attachUiListeners()
	}
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
		if (listeners.size === 0) {
			detachUiListeners()
		}
	}
}

const setSideMenu = (v: boolean) => {
	setUiState({ sideMenuOpen: v })
}

const setUserSideMenuMinimised = (v: boolean) => {
	if (hasLocalStorage()) {
		localStorage.setItem(SideMenuMinimisedKey, String(v))
	}
	setUiState({
		userSideMenuMinimised: v,
		sideMenuMinimised: getResponsiveSideMenuMinimised(v),
	})
}

const setContainerRefs = (v: UiState['containerRefs']) => {
	setUiState({ containerRefs: v })
}

const setAdvancedMode = (value: boolean) => {
	if (hasLocalStorage()) {
		localStorage.setItem(AdvancedModeKey, String(value))
	}
	setUiState({ advancedMode: value })
}

const setShowHelp = (value: boolean) => {
	if (hasLocalStorage()) {
		localStorage.setItem(ShowHelpKey, String(value))
	}
	setUiState({ showHelp: value })
}

export const useUi = (): UiHookInterface => {
	const state = useSyncExternalStore(subscribeUi, getUiSnapshot, getUiSnapshot)

	return {
		...state,
		sideMenuMinimised: state.sideMenuMinimised && !state.advancedMode,
		setSideMenu,
		setUserSideMenuMinimised,
		setContainerRefs,
		setAdvancedMode,
		setShowHelp,
	}
}
