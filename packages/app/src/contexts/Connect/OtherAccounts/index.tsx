// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import {
	useExtensionAccounts,
	useExtensions,
	useHardwareAccounts,
} from '@w3ux/react-connect-kit'
import type { HardwareAccountSource } from '@w3ux/types'
import { setStateWithRef } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { getInitialExternalAccounts } from 'global-bus/util'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { ImportedAccount, MaybeAddress, NetworkId } from 'types'
import type { ExternalAccountImportType } from '../ExternalAccounts/types'
import { getActiveAccountLocal } from '../Utils'
import type { OtherAccountsContextInterface } from './types'

export const [OtherAccountsContext, useOtherAccounts] =
	createSafeContext<OtherAccountsContextInterface>()

export const OtherAccountsProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const { network } = useNetwork()
	const { gettingExtensions } = useExtensions()
	const { getHardwareAccounts } = useHardwareAccounts()
	const { setActiveAccount, activeAccount } = useActiveAccounts()
	const { extensionsSynced, getExtensionAccounts } = useExtensionAccounts()

	const { ss58 } = getStakingChainData(network)
	const extensionAccounts = getExtensionAccounts(ss58)

	// Store whether other (non-extension) accounts have been initialised
	const [otherAccountsSynced, setOtherAccountsSynced] = useState<boolean>(false)

	// Store other (non-extension) accounts list
	const [otherAccounts, setOtherAccounts] = useState<ImportedAccount[]>([])
	// Ref is needed to refer to updated state in-between renders as local accounts are imported from
	// different sources
	const otherAccountsRef = useRef(otherAccounts)

	// Store whether all accounts have been synced
	const [accountsInitialised, setAccountsInitialised] = useState<boolean>(false)

	// Handle forgetting of an imported other account
	const forgetOtherAccounts = (forget: ImportedAccount[]) => {
		if (forget.length) {
			// Remove forgotten accounts from context state. Compare by both address and source to allow
			// same address from different sources to remain
			setStateWithRef(
				[...otherAccountsRef.current].filter(
					(a) =>
						forget.find(
							({ address, source }) =>
								address === a.address && source === a.source,
						) === undefined,
				),
				setOtherAccounts,
				otherAccountsRef,
			)
			// If the currently active account is being forgotten, disconnect
			if (
				// Active account is present
				activeAccount &&
				// Active account is being forgotten
				forget.find(
					({ address, source }) =>
						address === activeAccount.address &&
						source === activeAccount.source,
				) !== undefined &&
				// No other account exists with same address and source
				otherAccountsRef.current.find(
					({ address, source }) =>
						address === activeAccount.address &&
						source === activeAccount.source,
				) === undefined
			) {
				setActiveAccount(null)
			}
		}
	}

	// Checks `localStorage` for previously added accounts from the provided source, and adds them to
	// `accounts` state. if local active account is present, it will also be assigned as active. For
	// non-external accounts, accounts with the same address but different sources are allowed.
	// External accounts are still prevented from being duplicated.
	const importLocalOtherAccounts = <T extends HardwareAccountSource | string>(
		source: T,
		getter: (source: T, network: NetworkId) => ImportedAccount[],
	) => {
		// Get accounts from provided `getter` function
		let localAccounts = getter(source, network)

		if (localAccounts.length) {
			// For external accounts, prevent duplicates by address only (regardless of source). For other
			// accounts (hardware wallets), allow same address with different sources
			if (source === 'external') {
				// Remove external accounts that are already imported from any source
				localAccounts = localAccounts.filter(
					(l) =>
						extensionAccounts.find(({ address }) => address === l.address) ===
							undefined &&
						otherAccountsRef.current.find(
							({ address }) => address === l.address,
						) === undefined,
				)
			} else {
				// For hardware accounts, only remove if the same address AND source combination exists
				localAccounts = localAccounts.filter(
					(l) =>
						extensionAccounts.find(
							({ address, source: s }) =>
								address === l.address && s === l.source,
						) === undefined &&
						otherAccountsRef.current.find(
							({ address, source: s }) =>
								address === l.address && s === l.source,
						) === undefined,
				)
			}

			const activeAccountFound =
				localAccounts.find(
					({ address }) =>
						address === getActiveAccountLocal(network, ss58)?.address,
				) ?? null

			// If active account found, set to state
			if (activeAccountFound) {
				setActiveAccount({
					address: activeAccountFound.address,
					source: activeAccountFound.source,
				})
			}

			// add accounts to imported
			addOtherAccounts(localAccounts)
		}
	}

	// Renames an other account
	// Now requires source to identify the specific account when same address exists from multiple sources
	const renameOtherAccount = (
		address: MaybeAddress,
		source: string,
		newName: string,
	) => {
		setStateWithRef(
			[...otherAccountsRef.current].map((a) =>
				a.address !== address || a.source !== source
					? a
					: {
							...a,
							name: newName,
						},
			),
			setOtherAccounts,
			otherAccountsRef,
		)
	}

	// Add other accounts to context state
	const addOtherAccounts = (accounts: ImportedAccount[]) => {
		setStateWithRef(
			[...otherAccountsRef.current].concat(accounts),
			setOtherAccounts,
			otherAccountsRef,
		)
	}

	// Replace other account with new entry
	// Compare by both address and source to target the specific account
	const replaceOtherAccount = (account: ImportedAccount) => {
		setStateWithRef(
			[...otherAccountsRef.current].map((item) =>
				item.address !== account.address || item.source !== account.source
					? item
					: account,
			),
			setOtherAccounts,
			otherAccountsRef,
		)
	}

	// Add or replace other account with an entry
	const addOrReplaceOtherAccount = (
		account: ImportedAccount,
		type: ExternalAccountImportType,
	) => {
		if (type === 'new') {
			addOtherAccounts([account])
		} else if (type === 'replace') {
			replaceOtherAccount(account)
		}
	}

	// Re-sync other accounts on network switch. Waits for `injectedWeb3` to be injected
	useEffect(() => {
		if (!gettingExtensions) {
			setStateWithRef([], setOtherAccounts, otherAccountsRef)
		}
	}, [network, gettingExtensions])

	// Once extensions are fully initialised, fetch accounts from other sources
	useEffectIgnoreInitial(() => {
		if (extensionsSynced === 'synced') {
			// Fetch accounts from supported hardware wallets
			importLocalOtherAccounts('vault', getHardwareAccounts)
			importLocalOtherAccounts('ledger', getHardwareAccounts)
			importLocalOtherAccounts('wallet_connect', getHardwareAccounts)

			// Mark hardware wallets as initialised
			setOtherAccountsSynced(true)

			// Finally, fetch any read-only accounts that have been added by `system` or `user`
			importLocalOtherAccounts('external', getInitialExternalAccounts)
		}
	}, [network, extensionsSynced])

	// Account fetching complete, mark accounts as initialised. Does not include read only accounts
	useEffectIgnoreInitial(() => {
		if (extensionsSynced === 'synced' && otherAccountsSynced) {
			setAccountsInitialised(true)
		}
	}, [extensionsSynced, otherAccountsSynced])

	return (
		<OtherAccountsContext.Provider
			value={{
				addOtherAccounts,
				addOrReplaceOtherAccount,
				renameOtherAccount,
				importLocalOtherAccounts,
				forgetOtherAccounts,
				accountsInitialised,
				otherAccounts,
			}}
		>
			{children}
		</OtherAccountsContext.Provider>
	)
}
