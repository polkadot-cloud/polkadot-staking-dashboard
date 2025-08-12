// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import type { InviteConfig } from './types'
import { isInviteValid } from './util'

// Get a local invite configuration from local storage
export const getLocalInviteConfig = () => {
	try {
		const result = localStorageOrDefault('invite', undefined, true) as
			| InviteConfig
			| undefined
		const valid = isInviteValid(result)
		if (valid) {
			return result
		}
		throw new Error()
	} catch {
		removeLocalInviteConfig()
		return undefined
	}
}

// Set a local invite configuration in local storage
export const setLocalInviteConfig = (inviteConfig: InviteConfig) => {
	localStorage.setItem('invite', JSON.stringify(inviteConfig))
}

// Remove invite from local storage
export const removeLocalInviteConfig = () => {
	localStorage.removeItem('invite')
}
