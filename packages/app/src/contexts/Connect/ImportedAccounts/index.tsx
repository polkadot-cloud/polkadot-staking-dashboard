// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { useExtensionAccounts } from '@w3ux/react-connect-kit'
import { ManualSigners } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import type {
	ActiveAccount,
	ExternalAccount,
	ImportedAccount,
	MaybeAddress,
} from 'types'
import { useOtherAccounts } from '../OtherAccounts'
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
	const { otherAccounts } = useOtherAccounts()
	const { setActiveAccount } = useActiveAccounts()
	const { getExtensionAccounts } = useExtensionAccounts()

	const { ss58 } = getStakingChainData(network)
	// Get the imported extension accounts formatted with the current network's ss58 prefix
	const extensionAccounts = getExtensionAccounts(ss58)
	const allAccounts = extensionAccounts.concat(otherAccounts)

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

	return (
		<ImportedAccountsContext.Provider
			value={{
				accounts: allAccounts,
				getAccount,
				isReadOnlyAccount,
				accountHasSigner,
				requiresManualSign,
				stringifiedAccountsKey,
			}}
		>
			{children}
		</ImportedAccountsContext.Provider>
	)
}
