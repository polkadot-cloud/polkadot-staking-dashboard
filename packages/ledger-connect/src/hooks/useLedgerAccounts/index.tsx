// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHardwareAccounts } from '@w3ux/react-connect-kit'
import type { HardwareAccount, HardwareAccountSource } from '@w3ux/types'

const source: HardwareAccountSource = 'ledger'

/**
 * Proxy hook that wraps `useHardwareAccounts` with `source='ledger'` pre-bound. All account
 * operations are scoped to the provided network.
 */
export const useLedgerAccounts = (network: string) => {
	const {
		addHardwareAccount,
		removeHardwareAccount,
		renameHardwareAccount,
		getHardwareAccount,
		getHardwareAccounts,
		hardwareAccountExists,
	} = useHardwareAccounts()

	const getLedgerAccounts = (): HardwareAccount[] =>
		getHardwareAccounts(source, network)

	const getLedgerAccount = (address: string): HardwareAccount | null =>
		getHardwareAccount(source, network, address)

	const addLedgerAccount = (
		group: number,
		address: string,
		index: number,
		callback?: () => void,
	): HardwareAccount | null =>
		addHardwareAccount(source, network, group, address, index, callback)

	const removeLedgerAccount = (
		address: string,
		callback?: () => void,
	): void => {
		removeHardwareAccount(source, network, address, callback)
	}

	const renameLedgerAccount = (address: string, name: string): void => {
		renameHardwareAccount(source, network, address, name)
	}

	const ledgerAccountExists = (address: string): boolean =>
		hardwareAccountExists(source, network, address)

	return {
		getLedgerAccounts,
		getLedgerAccount,
		addLedgerAccount,
		removeLedgerAccount,
		renameLedgerAccount,
		ledgerAccountExists,
	}
}
