// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Supported Ledger device models.
 */
export type LedgerDeviceModel =
	| 'nano_s'
	| 'nano_x'
	| 'nano_s_plus'
	| 'flex'
	| 'stax'
	| 'unknown'

/**
 * Device family grouping: nano (button-based) vs touchscreen.
 */
export type LedgerDeviceFamily = 'nano' | 'touchscreen' | 'unknown'

/**
 * Maps a WebHID `productName` string to a known `LedgerDeviceModel`.
 *
 * WebHID typically reports names like "Ledger Nano S", "Ledger Nano X",
 * "Ledger Nano S Plus", "Ledger Flex", "Ledger Stax". Uses `includes()`
 * for resilience to firmware variations. Order matters: "Nano S Plus" is
 * checked before "Nano S" to avoid false matches.
 */
export const getLedgerDeviceModel = (
	productName: string
): LedgerDeviceModel => {
	if (!productName) {
		return 'unknown'
	}

	// Check "Nano S Plus" before "Nano S" to avoid substring match
	if (productName.includes('Nano S Plus')) {
		return 'nano_s_plus'
	}
	if (productName.includes('Nano X')) {
		return 'nano_x'
	}
	if (productName.includes('Nano S')) {
		return 'nano_s'
	}
	if (productName.includes('Flex')) {
		return 'flex'
	}
	if (productName.includes('Stax')) {
		return 'stax'
	}

	return 'unknown'
}

/**
 * Returns the device family for a given model.
 */
export const getLedgerDeviceFamily = (
	model: LedgerDeviceModel
): LedgerDeviceFamily => {
	switch (model) {
		case 'nano_s':
		case 'nano_x':
		case 'nano_s_plus':
			return 'nano'
		case 'flex':
		case 'stax':
			return 'touchscreen'
		default:
			return 'unknown'
	}
}

/**
 * Returns true if the device has a touchscreen (Flex or Stax).
 */
export const isTouchscreenDevice = (model: LedgerDeviceModel): boolean =>
	model === 'flex' || model === 'stax'

/**
 * Returns a human-readable device name for display in the UI.
 */
export const getLedgerDeviceName = (model: LedgerDeviceModel): string => {
	switch (model) {
		case 'nano_s':
			return 'Ledger Nano S'
		case 'nano_x':
			return 'Ledger Nano X'
		case 'nano_s_plus':
			return 'Ledger Nano S Plus'
		case 'flex':
			return 'Ledger Flex'
		case 'stax':
			return 'Ledger Stax'
		default:
			return 'Ledger'
	}
}
