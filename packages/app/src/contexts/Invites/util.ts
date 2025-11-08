// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { removeLocalInviteConfig } from './local'
import type { LocalInviteConfig } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <>
export const isLocalInviteValid = (raw: any): raw is LocalInviteConfig => {
	try {
		if (
			!raw ||
			typeof raw !== 'object' ||
			typeof raw.network !== 'string' ||
			typeof raw.invite !== 'object' ||
			typeof raw.acknowledged !== 'boolean'
		) {
			return false
		}

		const { poolId } = raw.invite
		return typeof poolId === 'number' && !isNaN(poolId)
	} catch {
		removeLocalInviteConfig()
		return false
	}
}
