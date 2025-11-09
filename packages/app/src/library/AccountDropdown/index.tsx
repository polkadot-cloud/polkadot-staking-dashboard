// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import LedgerSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import { ExtensionIcons } from '@w3ux/extension-assets/util'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { useOutsideAlerter } from '@w3ux/hooks'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn, isValidAddress, planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util/chains'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { RootPortal } from 'library/RootPortal'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'
import type { ImportedAccount } from 'types'
import { AccountInput } from 'ui-core/input'
import { getTransferrableBalance } from 'utils'
import type { AccountDropdownProps } from './types'

export const AccountDropdown = ({
	accounts,
	initialAccount,
	onSelect,
	onOpenChange,
}: AccountDropdownProps) => {
	const { t } = useTranslation()
	const { serviceApi } = useApi()
	const { network } = useNetwork()
	const { units, unit } = getStakingChainData(network)

	// Manage internal state for selected account
	const [selectedAccount, setSelectedAccount] =
		useState<ImportedAccount | null>(
			initialAccount !== undefined
				? initialAccount
				: accounts.length > 0
					? accounts[0]
					: null,
		)

	// The currently selected address of this input
	const selectedAddress = selectedAccount?.address || ''

	// Fetch account balance asynchronously
	const [transferableBalance, setTransferableBalance] = useState<bigint>(0n)

	// Whether the dropdown is open
	const [isOpen, setIsOpen] = useState(false)

	// Search term for filtering accounts
	const [searchTerm, setSearchTerm] = useState('')

	// Whether the input is currently focused
	const [isInputFocused, setIsInputFocused] = useState(false)

	// Dropdown position calculated from button bounds
	const [dropdownPosition, setDropdownPosition] = useState<{
		top: number
		left: number
		width: number
	} | null>(null)

	const handleFetchBalance = async (address: string) => {
		if (!address) return
		const result = await serviceApi.query.accountBalance.hub(address)
		const balance = getTransferrableBalance(result?.free || 0n, 0n)
		setTransferableBalance(balance)
	}

	// Handle opening of dropdown if there are accounts to choose from
	const handleOpenDropdown = () => {
		if (accounts.length > 0) {
			setIsOpen(true)
		}
	}

	const dropdownRef = useRef<HTMLButtonElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	// Calculate dropdown position when opened
	useEffect(() => {
		if (isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect()
			setDropdownPosition({
				top: rect.bottom + window.scrollY + 4, // 4px gap below button
				left: rect.left + window.scrollX,
				width: rect.width,
			})
		}
	}, [isOpen])

	// Close dropdown on window resize to prevent position desync
	useEffect(() => {
		const handleResize = () => {
			if (isOpen) {
				setIsOpen(false)
			}
		}
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [isOpen])

	// Close dropdown on window scroll to prevent position desync
	useEffect(() => {
		const handleScroll = (e: Event) => {
			// Only close if the scroll target is not the dropdown menu
			if (
				isOpen &&
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
				setSearchTerm('')
				setIsInputFocused(false)
			}
		}
		window.addEventListener('scroll', handleScroll, true) // Use capture phase
		return () => {
			window.removeEventListener('scroll', handleScroll, true)
		}
	}, [isOpen])

	// Notify parent when dropdown state changes
	useEffect(() => {
		onOpenChange?.(isOpen)
	}, [isOpen, onOpenChange, accounts])

	useEffect(() => {
		handleFetchBalance(selectedAddress)
	}, [selectedAddress])

	// Sync internal state when accounts change
	useEffect(() => {
		if (
			initialAccount === undefined &&
			!selectedAccount &&
			accounts.length > 0
		) {
			setSelectedAccount(accounts[0])
		}
	}, [accounts, selectedAccount, initialAccount])

	// Filter accounts based on search term
	let filteredAccounts = accounts.filter(
		(account) =>
			account.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			account.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// If search term is a valid address and not already in accounts, add it as a temporary entry
	const validAddress = isValidAddress(searchTerm)
	if (
		validAddress &&
		!accounts.some((account) => account.address === searchTerm)
	) {
		filteredAccounts = [
			{
				address: searchTerm,
				name: searchTerm,
				source: 'external',
			} as ImportedAccount,
			...filteredAccounts,
		]
	}

	// Handle account selection
	const handleSelect = (account: ImportedAccount) => {
		setSelectedAccount(account)
		// Call callback
		onSelect?.(account)

		setIsOpen(false)
		setSearchTerm('')
		setIsInputFocused(false)
		inputRef.current?.blur()
	}

	// Close dropdown menu if clicked outside of its container
	useOutsideAlerter(dropdownRef, () => {
		setIsOpen(false)
		setSearchTerm('')
		setIsInputFocused(false)
	}, ['selected-account', 'account-input-dropdown'])

	// Display value for the input field
	const inputValue = isInputFocused ? searchTerm : selectedAccount?.name || ''

	// Determine selected account source icon
	const SelectedIcon = selectedAccount
		? selectedAccount.source === 'ledger'
			? LedgerSVG
			: selectedAccount.source === 'vault'
				? PolkadotVaultSVG
				: selectedAccount.source === 'wallet_connect'
					? WalletConnectSVG
					: ExtensionIcons[selectedAccount.source] || undefined
		: undefined

	return (
		<>
			<AccountInput.Container
				className="selected-account"
				ref={dropdownRef}
				onClick={() => {
					if (!isInputFocused) {
						handleOpenDropdown()
						inputRef.current?.focus()
					}
				}}
			>
				<span
					style={{
						opacity: isInputFocused || !selectedAccount ? 0.25 : 1,
						transition: 'opacity 0.15s',
					}}
				>
					<Polkicon
						address={selectedAccount?.address || ''}
						fontSize="3rem"
						background="transparent"
					/>
				</span>
				<AccountInput.InnerLeft>
					<AccountInput.Input
						ref={inputRef}
						placeholder={
							selectedAccount?.name || t('searchAddress', { ns: 'app' })
						}
						value={inputValue}
						onChange={(e) => {
							setSearchTerm(e.target.value)
							if (!isOpen) {
								handleOpenDropdown()
							}
						}}
						onFocus={() => {
							setIsInputFocused(true)
							handleOpenDropdown()
						}}
						onBlur={() => {
							// Small delay to allow click events to fire
							setTimeout(() => {
								setIsInputFocused(false)
							}, 150)
						}}
					/>
					{!isInputFocused && selectedAccount && (
						<AccountInput.Address address={selectedAccount?.address || ''} />
					)}
				</AccountInput.InnerLeft>
				{!isInputFocused && selectedAccount && (
					<AccountInput.InnerRight>
						<div>
							<AccountInput.Balance
								label={t('free', { ns: 'modals' })}
								value={new BigNumber(
									planckToUnit(transferableBalance || 0n, units),
								)
									.decimalPlaces(3)
									.toFormat()}
								unit={unit}
							/>
						</div>
						{SelectedIcon !== undefined ? (
							<AccountInput.SourceIcon SvgIcon={SelectedIcon} />
						) : selectedAccount?.source === 'external' ? (
							<AccountInput.SourceIcon faIcon={faGlasses} />
						) : null}
					</AccountInput.InnerRight>
				)}
			</AccountInput.Container>

			{isOpen && dropdownPosition && (
				<RootPortal
					width={dropdownPosition.width}
					top={dropdownPosition.top}
					left={dropdownPosition.left}
				>
					<AccountInput.ListContainer
						ref={menuRef}
						className="account-input-dropdown"
					>
						<SimpleBar style={{ maxHeight: '300px' }}>
							{filteredAccounts.length > 0
								? filteredAccounts.map((account) => {
										// Determine account source icon
										const Icon =
											account.source === 'ledger'
												? LedgerSVG
												: account.source === 'vault'
													? PolkadotVaultSVG
													: account.source === 'wallet_connect'
														? WalletConnectSVG
														: ExtensionIcons[account.source] || undefined

										return (
											<AccountInput.ListItem
												account={account}
												isSelected={
													selectedAccount?.address === account.address &&
													selectedAccount?.source === account.source
												}
												key={`${account.address}-${account.source}`}
												onClick={handleSelect}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														handleSelect(account)
													}
												}}
											>
												<Polkicon
													address={account.address}
													fontSize="2.25rem"
													background="transparent"
												/>
												<AccountInput.InnerLeft>
													<AccountInput.ListName
														name={
															account.name || ellipsisFn(account.address, 6)
														}
													/>
													<AccountInput.Address address={account.address} />
												</AccountInput.InnerLeft>
												{Icon !== undefined ? (
													<AccountInput.SourceIcon SvgIcon={Icon} size="sm" />
												) : selectedAccount?.source === 'external' ? (
													<AccountInput.SourceIcon
														faIcon={faGlasses}
														size="sm"
													/>
												) : null}
											</AccountInput.ListItem>
										)
									})
								: null}
						</SimpleBar>
					</AccountInput.ListContainer>
				</RootPortal>
			)}
		</>
	)
}
