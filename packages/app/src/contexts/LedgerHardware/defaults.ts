// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerDeviceModel } from 'types'

export const defaultDeviceModel: LedgerDeviceModel = 'unknown'

export const defaultFeedback = {
	message: null,
	helpKey: null,
}

// Ledger error keyed by type of error
export const errorsByType = {
	timeout: ['Error: Timeout'],
	methodNotSupported: ['Error: Method not supported'],
	nestingNotSupported: ['Error: Call nesting not supported'],
	outsideActiveChannel: ['Error: TransportError: Invalid channel'],
	deviceNotConnected: ['TransportOpenUserCancelled'],
	deviceBusy: ['Error: Ledger Device is busy', 'InvalidStateError'],
	deviceLocked: ['Error: LockedDeviceError'],
	transactionRejected: ['Error: Transaction rejected'],
	txVersionNotSupported: ['Error: Txn version not supported'],
	appNotOpen: ['Error: Unknown Status Code: 28161'],
}
