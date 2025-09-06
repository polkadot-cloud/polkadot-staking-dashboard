// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, localStorageOrDefault } from '@w3ux/utils'
import { AdvancedModeKey } from 'consts'
import { defaultAdvancedMode } from './defaults'

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
