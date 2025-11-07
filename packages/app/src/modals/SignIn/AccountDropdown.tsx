// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useEffect, useRef, useState } from 'react'
import type { ImportedAccount } from 'types'
import type { AccountDropdownProps } from './types'
import {
	DropdownButton,
	DropdownMenu,
	DropdownSpacer,
	DropdownWrapper,
} from './Wrappers'

export const AccountDropdown = ({
	accounts,
	selectedAccount,
	onSelect,
	onOpenChange,
}: AccountDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [dropdownHeight, setDropdownHeight] = useState(0)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	// Notify parent when dropdown state changes
	useEffect(() => {
		onOpenChange?.(isOpen)
	}, [isOpen, onOpenChange])

	// Measure dropdown height when it opens
	useEffect(() => {
		if (isOpen && menuRef.current) {
			const height = menuRef.current.offsetHeight
			const maxHeight = Math.min(height, window.innerHeight * 0.5)
			setDropdownHeight(maxHeight)
		} else {
			setDropdownHeight(0)
		}
	}, [isOpen, accounts.length, searchTerm])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Filter accounts based on search term
	const filteredAccounts = accounts.filter(
		(account) =>
			account.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			account.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const handleSelect = (account: ImportedAccount) => {
		onSelect(account)
		setIsOpen(false)
		setSearchTerm('')
	}

	return (
		<>
			<DropdownWrapper ref={dropdownRef}>
				<DropdownButton onClick={() => setIsOpen(!isOpen)}>
					{selectedAccount ? (
						<div className="selected-account">
							<Polkicon address={selectedAccount.address} />
							<div className="account-details">
								<span className="account-name">
									{selectedAccount.name || 'Unknown'}
								</span>
								<span className="account-address">
									{ellipsisFn(selectedAccount.address)}
								</span>
							</div>
						</div>
					) : (
						<span>Select an account</span>
					)}
					<FontAwesomeIcon
						icon={faChevronDown}
						className={`chevron ${isOpen ? 'open' : ''}`}
					/>
				</DropdownButton>

				{isOpen && (
					<DropdownMenu ref={menuRef}>
						<div className="search-container">
							<input
								type="text"
								placeholder="Search by address or name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
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
				)}
			</DropdownWrapper>

			{/* Spacer to reserve space for the dropdown */}
			<DropdownSpacer height={dropdownHeight} />
		</>
	)
}
