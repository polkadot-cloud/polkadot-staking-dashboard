// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import {
	useExtensionAccounts,
	useHardwareAccounts,
} from '@w3ux/react-connect-kit'
import type { ExtensionAccount, HardwareAccount } from '@w3ux/types'
import { ManualSigners } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'
import type {
	ActiveAccount,
	ExternalAccount,
	ImportedAccount,
	MaybeAddress,
} from 'types'
import { useExternalAccounts } from '../ExternalAccounts'
import { getActiveAccountLocal } from '../Utils'
import type { ImportedAccountsContextInterface } from './types'

export const [ImportedAccountsContext, useImportedAccounts] =
	createSafeContext<ImportedAccountsContextInterface>()

export const ImportedAccountsProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const { network } = useNetwork()
	const { getExternalAccounts } = useExternalAccounts()
	const { getHardwareAccounts } = useHardwareAccounts()
	const { setActiveAccount, activeAccount } = useActiveAccounts()
	const { getExtensionAccounts, extensionsSynced } = useExtensionAccounts()
	const { ss58 } = getStakingChainData(network)

	// Whether active account import checks have been completed
	const [accountsInitialised, setAccountsInitialised] = useState<boolean>(false)

	// Get the imported extension accounts formatted with the current network's ss58 prefix
	const extensionAccounts: ExtensionAccount[] = getExtensionAccounts(ss58)

	// Get the imported hardware accounts for the current network
	const hardwareAccounts: HardwareAccount[] = getHardwareAccounts(
		'ledger',
		network,
	)
		.concat(getHardwareAccounts('vault', network))
		.concat(getHardwareAccounts('wallet_connect', network))

	// Get the imported extenral accounts for the current network
	const externalAccounts: ExternalAccount[] = getExternalAccounts(network)

	// Combine all imported accounts
	const allAccounts: ImportedAccount[] = extensionAccounts
		.concat(hardwareAccounts)
		.concat(externalAccounts)

	// Stringify account addresses and account names to determine if they have changed. Ignore other properties including `signer` and `source`
	const shallowAccountStringify = (accounts: ImportedAccount[]) => {
		const sorted = accounts.sort((a, b) => {
			if (a.address < b.address) {
				return -1
			}
			if (a.address > b.address) {
				return 1
			}
			return 0
		})
		return JSON.stringify(
			sorted.map((account) => [account.address, account.source, account.name]),
		)
	}

	const stringifiedAccountsKey = shallowAccountStringify(allAccounts)

	// Gets an account from `allAccounts`. Requires activeAccount (with address and source) to get the
	// specific account-source combination
	//
	// Caches the function when imported accounts update
	const getAccount = useCallback(
		(activeAccount: ActiveAccount) => {
			if (!activeAccount) {
				return null
			}
			return (
				allAccounts.find(
					({ address, source }) =>
						address === activeAccount.address &&
						source === activeAccount.source,
				) || null
			)
		},
		[stringifiedAccountsKey],
	)

	// Checks if an address is a read-only account
	//
	// Caches the function when imported accounts update
	const isReadOnlyAccount = useCallback(
		(who: MaybeAddress) => {
			const account = allAccounts.find(({ address }) => address === who) || {}
			if (Object.hasOwn(account, 'addedBy')) {
				const { addedBy } = account as ExternalAccount
				return addedBy === 'user'
			}
			return false
		},
		[stringifiedAccountsKey],
	)

	// Checks whether an account can sign transactions. Requires activeAccount (with address and
	// source) to check the specific account-source combination
	//
	// Caches the function when imported accounts update
	const accountHasSigner = useCallback(
		(activeAccount: ActiveAccount) => {
			if (!activeAccount) {
				return false
			}
			const account = allAccounts.find(
				(acc) =>
					acc.address === activeAccount.address &&
					acc.source === activeAccount.source &&
					acc.source !== 'external',
			)
			return account !== undefined
		},
		[stringifiedAccountsKey],
	)

	// Checks whether an account needs manual signing. Requires activeAccount (with address and
	// source) to check the specific account-source combination
	//
	// Caches the function when imported accounts update
	const requiresManualSign = useCallback(
		(activeAccount: ActiveAccount) => {
			if (!activeAccount) {
				return false
			}
			const account = allAccounts.find(
				(acc) =>
					acc.address === activeAccount.address &&
					acc.source === activeAccount.source &&
					ManualSigners.includes(acc.source),
			)
			return account !== undefined
		},
		[stringifiedAccountsKey],
	)

	// Re-sync the active account on network change
	// Now checks for both address and source to support multi-source accounts
	useEffectIgnoreInitial(() => {
		const localActiveAccount = getActiveAccountLocal(network, ss58)
		if (localActiveAccount && getAccount(localActiveAccount) !== null) {
			setActiveAccount(localActiveAccount, false)
		} else {
			setActiveAccount(null, false)
		}
	}, [network, stringifiedAccountsKey])

	// Once extensions are fully initialised, fetch accounts from other sources and re-sync active
	// account
	useEffectIgnoreInitial(() => {
		if (extensionsSynced === 'synced' && !accountsInitialised) {
			setAccountsInitialised(true)

			// If active account is not yet set, check if it has been imported in other accounts
			if (!activeAccount) {
				const activeAccountFound = allAccounts.find(
					({ address }) =>
						address === getActiveAccountLocal(network, ss58)?.address,
				)
				if (activeAccountFound) {
					setActiveAccount({
						address: activeAccountFound.address,
						source: activeAccountFound.source,
					})
				}
			}
		}
	}, [network, extensionsSynced])

	return (
		<ImportedAccountsContext.Provider
			value={{
				accounts: allAccounts,
				getAccount,
				isReadOnlyAccount,
				accountHasSigner,
				requiresManualSign,
				stringifiedAccountsKey,
				accountsInitialised,
			}}
		>
			{children}
		</ImportedAccountsContext.Provider>
	)
}
