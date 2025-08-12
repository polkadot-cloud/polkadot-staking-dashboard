// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { PoolSetupsKey } from 'consts'
import type { PoolSetups } from './types'

// Utility to get pool setups, type casted as PoolSetups
export const getLocalPoolSetups = () =>
	localStorageOrDefault(PoolSetupsKey, {}, true) as PoolSetups

// Either update local pool setups or remove if empty
export const setLocalPoolSetups = (setups: PoolSetups) => {
	const setupsStr = JSON.stringify(setups)

	if (setupsStr === '{}') {
		localStorage.removeItem(PoolSetupsKey)
	} else {
		localStorage.setItem(PoolSetupsKey, setupsStr)
	}
}
