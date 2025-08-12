// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isValidAddress } from '@w3ux/utils'
import { removeLocalInviteConfig } from './local'
import type { InviteConfig } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <>
export const isInviteValid = (raw: any): raw is InviteConfig => {
	try {
		if (
			!raw ||
			typeof raw !== 'object' ||
			typeof raw.network !== 'string' ||
			typeof raw.invite !== 'object'
		) {
			return false
		}

		switch (raw.type) {
			case 'pool': {
				const { poolId } = raw.invite
				return typeof poolId === 'number' && !Number.isNaN(poolId)
			}
			case 'validator': {
				const { validators } = raw.invite
				return (
					Array.isArray(validators) &&
					validators.length > 0 &&
					validators.every((v) => isValidAddress(v))
				)
			}
			default:
				return false
		}
	} catch {
		removeLocalInviteConfig()
		return false
	}
}
