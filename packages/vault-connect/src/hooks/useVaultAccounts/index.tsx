// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHardwareAccounts } from '@w3ux/react-connect-kit'
import type { HardwareAccount, HardwareAccountSource } from '@w3ux/types'
import type { UseVaultAccountsReturn } from './types'

const source: HardwareAccountSource = 'vault'

/**
 * Proxy hook that wraps `useHardwareAccounts` with `source='vault'` pre-bound. All account
 * operations are scoped to the provided network.
 */
export const useVaultAccounts = (network: string): UseVaultAccountsReturn => {
	const {
		addHardwareAccount,
		removeHardwareAccount,
		renameHardwareAccount,
		getHardwareAccount,
		getHardwareAccounts,
		hardwareAccountExists,
	} = useHardwareAccounts()

	const getVaultAccounts = (): HardwareAccount[] =>
		getHardwareAccounts(source, network)

	const getVaultAccount = (address: string): HardwareAccount | null =>
		getHardwareAccount(source, network, address)

	const addVaultAccount = (
		group: number,
		address: string,
		index: number,
		callback?: () => void,
	): HardwareAccount | null =>
		addHardwareAccount(source, network, group, address, index, callback)

	const removeVaultAccount = (address: string, callback?: () => void): void => {
		removeHardwareAccount(source, network, address, callback)
	}

	const renameVaultAccount = (address: string, name: string): void => {
		renameHardwareAccount(source, network, address, name)
	}

	const vaultAccountExists = (address: string): boolean =>
		hardwareAccountExists(source, network, address)

	return {
		getVaultAccounts,
		getVaultAccount,
		addVaultAccount,
		removeVaultAccount,
		renameVaultAccount,
		vaultAccountExists,
	}
}
