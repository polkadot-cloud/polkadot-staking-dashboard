// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import type { InviteConfig, LocalInviteConfig } from './types'
import { isLocalInviteValid } from './util'

// Get a local invite configuration from local storage
export const getLocalInviteConfig = () => {
	try {
		const result = localStorageOrDefault('invite', undefined, true) as
			| InviteConfig
			| undefined
		const valid = isLocalInviteValid(result)
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
export const setLocalInviteConfig = (inviteConfig: LocalInviteConfig) => {
	localStorage.setItem('invite', JSON.stringify(inviteConfig))
}

// Mark the local invite as acknowledged
export const acknowledgeLocalInvite = (ack: boolean) => {
	const current = getLocalInviteConfig()
	if (current) {
		const updated: LocalInviteConfig = {
			...current,
			acknowledged: ack,
		}
		setLocalInviteConfig(updated)
	}
}

// Remove invite from local storage
export const removeLocalInviteConfig = () => {
	localStorage.removeItem('invite')
}
