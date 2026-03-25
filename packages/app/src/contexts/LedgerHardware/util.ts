// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { errorsByType } from './defaults'

// Determine type of error returned by Ledger
export const getLedgerErrorType = (err: string) => {
	let errorType = null
	Object.entries(errorsByType).every(([type, errors]) => {
		let found = false
		errors.every((e) => {
			if (err.startsWith(e)) {
				errorType = type
				found = true
				return false
			}
			return true
		})
		if (found) {
			return false
		}
		return true
	})
	return errorType || 'misc'
}
