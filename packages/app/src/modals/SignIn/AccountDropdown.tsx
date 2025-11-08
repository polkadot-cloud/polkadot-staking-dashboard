// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { RootPortal } from 'library/RootPortal'
import { useEffect, useRef, useState } from 'react'
import type { ImportedAccount } from 'types'
import type { AccountDropdownProps } from './types'
import { DropdownButton, DropdownMenu, DropdownWrapper } from './Wrappers'

export const AccountDropdown = ({
	accounts,
	selectedAccount,
	onSelect,
	onOpenChange,
}: AccountDropdownProps) => {
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

	const dropdownRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	// Calculate dropdown position when opened
	useEffect(() => {
		if (isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect()
			setDropdownPosition({
				top: rect.bottom + 4, // 4px gap below button
				left: rect.left,
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

	// Notify parent when dropdown state changes
	useEffect(() => {
		onOpenChange?.(isOpen)
	}, [isOpen, onOpenChange])

	// Filter accounts based on search term
	const filteredAccounts = accounts.filter(
		(account) =>
			account.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			account.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// Handle account selection
	const handleSelect = (account: ImportedAccount) => {
		onSelect(account)
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
	}, ['selected-account', 'account-dropdown-menu'])

	// Display value for the input field
	const inputValue = isInputFocused ? searchTerm : selectedAccount?.name || ''

	return (
		<>
			<DropdownWrapper ref={dropdownRef}>
				<DropdownButton
					onClick={() => {
						if (!isOpen) {
							setIsOpen(true)
							inputRef.current?.focus()
						}
					}}
				>
					{selectedAccount ? (
						<div className="selected-account">
							<Polkicon address={selectedAccount.address} />
							<div className="account-details">
								<input
									ref={inputRef}
									type="text"
									className="account-name"
									placeholder="Search by address or name..."
									value={inputValue}
									onChange={(e) => {
										setSearchTerm(e.target.value)
										if (!isOpen) {
											setIsOpen(true)
										}
									}}
									onFocus={() => {
										setIsInputFocused(true)
										setIsOpen(true)
									}}
									onBlur={() => {
										// Small delay to allow click events to fire
										setTimeout(() => {
											setIsInputFocused(false)
										}, 150)
									}}
								/>
								<span className="account-address">
									{ellipsisFn(selectedAccount.address)}
								</span>
							</div>
						</div>
					) : (
						<span>Select an account</span>
					)}
				</DropdownButton>
			</DropdownWrapper>
			{isOpen && dropdownPosition && (
				<RootPortal
					width={dropdownPosition.width}
					top={dropdownPosition.top}
					left={dropdownPosition.left}
				>
					<DropdownMenu ref={menuRef} className="account-dropdown-menu">
						<div className="accounts-list">
							{filteredAccounts.length > 0 ? (
								filteredAccounts.map((account) => (
									<div
										key={`${account.address}-${account.source}`}
										className={`account-item ${
											selectedAccount?.address === account.address &&
											selectedAccount?.source === account.source
												? 'selected'
												: ''
										}`}
										onClick={() => handleSelect(account)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												handleSelect(account)
											}
										}}
									>
										<Polkicon address={account.address} />
										<div className="account-details">
											<span className="account-name">
												{account.name || 'Unknown'}
											</span>
											<span className="account-address">
												{ellipsisFn(account.address)}
											</span>
										</div>
										<span className="account-source">{account.source}</span>
									</div>
								))
							) : (
								<div className="no-results">No accounts found</div>
							)}
						</div>
					</DropdownMenu>
				</RootPortal>
			)}
		</>
	)
}
