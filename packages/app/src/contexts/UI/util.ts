// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, localStorageOrDefault } from '@w3ux/utils'
import { AdvancedModeKey, ShowHelpKey } from 'consts'
import { defaultAdvancedMode, defaultShowHelp } from './defaults'

// Get the initial advanced mode setting. Prioritises URL, then local storage, then default
export const getInitialAdvancedMode = (): boolean => {
	try {
		const urlMode = extractUrlValue('m')
		const localOrDefault = localStorageOrDefault(
			AdvancedModeKey,
			true,
			defaultAdvancedMode,
		) as boolean

		if (urlMode && ['simple', 'advanced'].includes(urlMode)) {
			const isAdvancedMode: boolean = urlMode === 'advanced'
			localStorage.setItem(AdvancedModeKey, String(isAdvancedMode))
			return isAdvancedMode
		}
		return localOrDefault
	} catch {
		// If an error occurs, fall back to the default value
		localStorage.setItem(AdvancedModeKey, String(defaultAdvancedMode))
		return defaultAdvancedMode
	}
}

// Get the initial show help setting
export const getInitialShowHelp = (): boolean => {
	try {
		const localOrDefault = localStorageOrDefault(
			ShowHelpKey,
			true,
			defaultShowHelp,
		) as boolean

		return localOrDefault
	} catch {
		// If an error occurs, fall back to the default value
		localStorage.setItem(ShowHelpKey, String(defaultShowHelp))
		return defaultShowHelp
	}
}
