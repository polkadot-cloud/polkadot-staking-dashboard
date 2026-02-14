// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useHardwareAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { HardwareAccount, HardwareAccountSource } from '@w3ux/types'
import { ellipsisFn, setStateWithRef } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import type {
	LedgerAddress,
	LedgerResponse,
} from 'contexts/LedgerHardware/types'
import { useNetwork } from 'contexts/Network'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'
import { Close, useOverlay } from 'ui-overlay'
import { Groups } from './Groups'

export const Ledger = () => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const {
		addHardwareAccount,
		removeHardwareAccount,
		renameHardwareAccount,
		hardwareAccountExists,
		getHardwareAccounts,
	} = useHardwareAccounts()
	const {
		getFeedback,
		setFeedback,
		isExecuting,
		setStatusCode,
		handleUnmount,
		resetStatusCode,
		handleGetAddress,
		fetchLedgerAddress,
		transportResponse,
		handleResetLedgerTask,
	} = useLedgerHardware()
	const { setModalResize } = useOverlay().modal
	const { ss58 } = getStakingChainData(network)
	const source: HardwareAccountSource = 'ledger'

	const initialAddresses = getHardwareAccounts(source, network)

	// Store addresses retrieved from Ledger device. Defaults to local addresses
	const [addresses, setAddresses] =
		useState<HardwareAccount[]>(initialAddresses)
	const addressesRef = useRef(addresses)
	const groupAnchorsRef = useRef<
		Record<number, { index: number; address: string }>
	>({})
	const [activeGroup, setActiveGroup] = useState<number>(1)
	const [groups, setGroups] = useState<number[]>(() => {
		const initialGroups = Array.from(
			new Set(initialAddresses.map((account) => account.group ?? 1)),
		)
		return initialGroups.length > 0 ? initialGroups.sort((a, b) => a - b) : [1]
	})

	const groupedAddresses = useMemo(() => {
		const grouped: Record<number, HardwareAccount[]> = {}
		addresses.forEach((account) => {
			const group = account.group ?? 1
			if (!grouped[group]) {
				grouped[group] = []
			}
			grouped[group].push(account)
		})
		return grouped
	}, [addresses])

	const addressGroups = useMemo(
		() => [...groups].sort((a, b) => a - b),
		[groups],
	)

	const activeAddresses = groupedAddresses[activeGroup] ?? []
	const latestGroup = addressGroups[addressGroups.length - 1] ?? 1
	const latestGroupIsEmpty = (groupedAddresses[latestGroup]?.length ?? 0) === 0
	const canAddGroup = !latestGroupIsEmpty

	// Handle exist check for a ledger address
	const handleExists = (address: string) =>
		hardwareAccountExists(source, network, address)

	// Handle renaming a ledger address
	const handleRename = (address: string, newName: string) => {
		renameHardwareAccount(source, network, address, newName)
	}

	// Handle removing a ledger address
	const handleRemove = (address: string) => {
		if (confirm(t('areYouSure', { ns: 'app' }))) {
			removeHardwareAccount(source, network, address)
			setStateWithRef(
				[...addressesRef.current.filter((a) => a.address !== address)],
				setAddresses,
				addressesRef,
			)
		}
	}

	// Gets the next non-imported ledger address index
	const getNextAddressIndex = () => {
		if (!activeAddresses.length) {
			return 0
		}
		return activeAddresses[activeAddresses.length - 1].index + 1
	}

	const ensureGroupMatchesDevice = async () => {
		const groupAccounts = groupedAddresses[activeGroup] ?? []
		const cachedAnchor = groupAnchorsRef.current[activeGroup] ?? null

		if (!cachedAnchor && groupAccounts.length === 0) {
			const anchorResult = await fetchLedgerAddress(0, ss58)
			if (!anchorResult?.address) {
				return false
			}
			groupAnchorsRef.current[activeGroup] = {
				index: 0,
				address: anchorResult.address,
			}
			return true
		}

		let anchor = cachedAnchor
		if (!anchor) {
			const [firstAccount, ...rest] = groupAccounts
			const anchorAccount = rest.reduce(
				(min, account) => (account.index < min.index ? account : min),
				firstAccount,
			)
			anchor = {
				index: anchorAccount.index,
				address: anchorAccount.address,
			}
			groupAnchorsRef.current[activeGroup] = anchor
		}

		const anchorResult = await fetchLedgerAddress(anchor.index, ss58)
		if (!anchorResult?.address) {
			return false
		}
		if (anchorResult.address !== anchor.address) {
			setFeedback(t('accountAlreadyImportedOtherDevice', { ns: 'modals' }))
			return false
		}
		return true
	}

	// Ledger address getter
	const onGetAddress = async () => {
		const matchesGroup = await ensureGroupMatchesDevice()
		if (!matchesGroup) {
			return
		}
		await handleGetAddress(getNextAddressIndex(), ss58)
	}

	// Handle new Ledger status report
	const handleLedgerStatusResponse = (response: LedgerResponse) => {
		if (!response) {
			return
		}
		const { ack, statusCode, body, options } = response
		setStatusCode({ ack, statusCode })

		if (statusCode === 'ReceivedAddress') {
			const existingAddresses = new Set(
				addressesRef.current.map((account) => account.address),
			)
			const newAddress = body
				.filter((item: LedgerAddress) => {
					const { address } = item
					if (existingAddresses.has(address)) {
						return false
					}
					return !hardwareAccountExists(source, network, address)
				})
				.map(({ pubKey, address }: LedgerAddress) => ({
					index: options.accountIndex,
					pubKey,
					address,
					name: ellipsisFn(address),
					network,
					group: activeGroup,
				}))

			if (newAddress.length > 0) {
				setStateWithRef(
					[...addressesRef.current, ...newAddress],
					setAddresses,
					addressesRef,
				)
				addHardwareAccount(
					source,
					network,
					activeGroup,
					newAddress[0].address,
					options.accountIndex,
				)
				if (!groupAnchorsRef.current[activeGroup]) {
					groupAnchorsRef.current[activeGroup] = {
						index: options.accountIndex,
						address: newAddress[0].address,
					}
				}
			} else if (body.length > 0) {
				setFeedback(t('accountAlreadyImportedOtherDevice', { ns: 'modals' }))
			}
			resetStatusCode()
		}
	}

	// Resets ledger accounts
	const resetLedgerAccounts = () => {
		addressesRef.current.forEach((account) => {
			removeHardwareAccount(source, network, account.address)
		})
		setStateWithRef([], setAddresses, addressesRef)
	}

	// Get last saved ledger feedback
	const feedback = getFeedback()

	// Listen for new Ledger status reports
	useEffectIgnoreInitial(() => {
		handleLedgerStatusResponse(transportResponse)
	}, [transportResponse])

	// Sync group list with any new groups found on addresses
	useEffect(() => {
		const derivedGroups = Array.from(
			new Set(addresses.map((account) => account.group ?? 1)),
		)
		if (derivedGroups.length === 0) {
			return
		}
		setGroups((prev) => {
			const merged = Array.from(new Set([...prev, ...derivedGroups])).sort(
				(a, b) => a - b,
			)
			const unchanged =
				merged.length === prev.length &&
				merged.every((value, index) => value === prev[index])
			return unchanged ? prev : merged
		})
	}, [addresses])

	useEffect(() => {
		Object.entries(groupedAddresses).forEach(([groupKey, accounts]) => {
			if (accounts.length === 0) {
				return
			}
			const group = Number(groupKey)
			if (groupAnchorsRef.current[group]) {
				return
			}
			const [firstAccount, ...rest] = accounts
			const anchorAccount = rest.reduce(
				(min, account) => (account.index < min.index ? account : min),
				firstAccount,
			)
			groupAnchorsRef.current[group] = {
				index: anchorAccount.index,
				address: anchorAccount.address,
			}
		})
	}, [groupedAddresses])

	useEffect(() => {
		Object.keys(groupAnchorsRef.current).forEach((groupKey) => {
			const group = Number(groupKey)
			const count = groupedAddresses[group]?.length ?? 0
			if (count === 0) {
				delete groupAnchorsRef.current[group]
			}
		})
	}, [groupedAddresses])

	// Keep the active group aligned with available groups
	useEffect(() => {
		if (addressGroups.length === 0) {
			if (activeGroup !== 1) {
				setActiveGroup(1)
			}
			return
		}
		if (!addressGroups.includes(activeGroup)) {
			setActiveGroup(addressGroups[0])
		}

		setFeedback(null)
	}, [addressGroups, activeGroup])

	// Tidy up context state when this component is no longer mounted
	useEffect(
		() => () => {
			handleUnmount()
		},
		[],
	)

	// Resize modal on account length / feedback change
	useEffect(() => {
		setModalResize()
	}, [activeAddresses.length, activeGroup, feedback?.message])

	const maybeFeedback = feedback?.message
	const minListHeight = '20rem'

	const handleAddGroup = () => {
		if (!canAddGroup) {
			return
		}
		setGroups((prev) => {
			const next = (prev.length ? Math.max(...prev) : 0) + 1
			setActiveGroup(next)
			return [...prev, next]
		})
	}

	return (
		<>
			<Close />
			{addressGroups.length >= 1 && (
				<Groups
					activeGroup={activeGroup}
					addressGroups={addressGroups}
					groupedAddresses={groupedAddresses}
					canAddGroup={canAddGroup}
					onGroupChange={setActiveGroup}
					onAddGroup={handleAddGroup}
				/>
			)}
			<AccountImport.Header
				Logo={<LedgerSquareSVG />}
				title="Ledger"
				websiteText="ledger.com"
				websiteUrl="https://ledger.com"
			>
				{addressesRef.current.length > 0 && (
					<span>
						<ButtonText
							text={t('reset', { ns: 'app' })}
							onClick={() => {
								if (confirm(t('areYouSure', { ns: 'app' }))) {
									resetLedgerAccounts()
								}
							}}
						/>
					</span>
				)}
				<span>
					<ButtonText
						text={
							isExecuting
								? t('cancel', { ns: 'app' })
								: t('importAnotherAccount', { ns: 'modals' })
						}
						iconLeft={faUsb}
						onClick={async () => {
							if (!isExecuting) {
								await onGetAddress()
							} else {
								handleResetLedgerTask()
							}
						}}
					/>
				</span>
			</AccountImport.Header>
			{!!maybeFeedback && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<h3 style={{ padding: '1rem 0 2rem 0' }}>{feedback?.message}</h3>
				</div>
			)}
			<div style={{ minHeight: minListHeight }}>
				{activeAddresses.length === 0 && !maybeFeedback && (
					<AccountImport.Empty>
						<h3>{t('importedAccount', { count: 0, ns: 'modals' })}</h3>
					</AccountImport.Empty>
				)}
				{activeAddresses.length > 0 &&
					activeAddresses.map(({ name, address }) => (
						<AccountImport.Item
							key={`ledger_imported_${address}`}
							address={address}
							last={
								address === activeAddresses[activeAddresses.length - 1]?.address
							}
							initial={name}
							Identicon={<Polkicon address={address} fontSize="3.3rem" />}
							existsHandler={handleExists}
							renameHandler={handleRename}
							onRemove={handleRemove}
						/>
					))}
			</div>
		</>
	)
}
