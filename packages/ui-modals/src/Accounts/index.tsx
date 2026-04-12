// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react'
import { CustomHeader, Padding } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { AccountItem } from './AccountItem'
import { ActionItem } from './ActionItem'
import classes from './index.module.scss'
import type {
	AccountInPoolData,
	AccountItemData,
	AccountNominatingInPoolData,
	AccountsProps,
} from './types'

export const Accounts = ({
	accounts,
	activeAddress,
	activeAccount,
	activeProxy,
	activeProxyType,
	setActiveAccount,
	setActiveProxy,
	getDelegates,
	getStakingLedger,
	getPoolMembership,
	getAccount,
	getImportedAccounts,
	getTransferableBalance,
	isSupportedProxy,
	network,
	unit,
	units,
	t,
}: AccountsProps) => {
	const { status: modalStatus, setModalResize, closeModal } = useOverlay().modal

	// construct account groupings
	const nominating: AccountItemData[] = []
	const inPool: AccountInPoolData[] = []
	const nominatingAndPool: AccountNominatingInPoolData[] = []
	const notStaking: AccountItemData[] = []

	for (const { address, source } of accounts) {
		const { ledger } = getStakingLedger(address)
		const { membership } = getPoolMembership(address)

		let isNominating = false
		let isInPool = false
		const delegates = getDelegates(address)

		// Check if nominating
		if (
			!!ledger &&
			nominating.find((a) => a.address === address && a.source === source) ===
				undefined
		) {
			isNominating = true
		}

		// Check if in pool
		if (membership) {
			if (!inPool.find((n) => n.address === address && n.source === source)) {
				isInPool = true
			}
		}

		// If not doing anything, add address to `notStaking`
		if (
			!isNominating &&
			!membership &&
			!notStaking.find((n) => n.address === address && n.source === source)
		) {
			notStaking.push({ address, source, delegates })
			continue
		}

		// If both nominating and in pool, add to this list
		if (
			isNominating &&
			isInPool &&
			membership &&
			!nominatingAndPool.find(
				(n) => n.address === address && n.source === source,
			)
		) {
			nominatingAndPool.push({
				...membership,
				address,
				source,
				delegates,
			})
			continue
		}

		// Nominating only
		if (isNominating && !isInPool) {
			nominating.push({ address, source, delegates })
			continue
		}
		// In pool only
		if (!isNominating && isInPool && membership) {
			inPool.push({ ...membership, source, delegates })
		}
	}

	const sharedProps = {
		activeAccount,
		activeProxy,
		activeAddress,
		activeProxyType,
		getAccount,
		getImportedAccounts,
		getTransferableBalance,
		setActiveAccount,
		setActiveProxy,
		isSupportedProxy,
		network,
		unit,
		units,
		t,
		closeModal,
	}

	// Resize if modal open upon state changes.
	useEffect(() => {
		if (modalStatus === 'open') {
			setModalResize()
		}
	}, [
		accounts,
		activeAddress,
		activeProxy,
		JSON.stringify(nominating.map((n) => n.address.toString())),
		JSON.stringify(inPool.map((p) => p.address)),
		JSON.stringify(nominatingAndPool.map((p) => p.address)),
		JSON.stringify(notStaking.map((p) => p.address)),
	])

	return (
		<>
			<Close />
			<Padding>
				<CustomHeader>
					<div>
						<h1>{t('accounts')}</h1>
					</div>
				</CustomHeader>
				{!activeAddress && !accounts.length && (
					<div
						className={classes.accountWrapper}
						style={{ marginTop: '1.5rem' }}
					>
						<div>
							<div>
								<h4 style={{ padding: '0.75rem 1rem' }}>
									{t('noActiveAccount')}
								</h4>
							</div>
							<div />
						</div>
					</div>
				)}
				{!!nominatingAndPool.length && (
					<>
						<div className={classes.accountSeparator} />
						<ActionItem text={t('nominatingAndInPool')} />
						{nominatingAndPool.map((item, i) => (
							<AccountItem
								key={`acc_nominating_and_pool_${i}`}
								{...item}
								{...sharedProps}
							/>
						))}
					</>
				)}
				{!!nominating.length && (
					<>
						<div className={classes.accountSeparator} />
						<ActionItem text={t('nominating')} />
						{nominating.map((item, i) => (
							<AccountItem
								key={`acc_nominating_${i}`}
								{...item}
								{...sharedProps}
							/>
						))}
					</>
				)}
				{!!inPool.length && (
					<>
						<div className={classes.accountSeparator} />
						<ActionItem text={t('inPool')} />
						{inPool.map((item, i) => (
							<AccountItem
								key={`acc_in_pool_${i}`}
								{...item}
								{...sharedProps}
							/>
						))}
					</>
				)}
				{!!notStaking.length && (
					<>
						<div className={classes.accountSeparator} />
						<ActionItem text={t('notStaking')} />
						{notStaking.map((item, i) => (
							<AccountItem
								key={`acc_not_staking_${i}`}
								{...item}
								{...sharedProps}
							/>
						))}
					</>
				)}
			</Padding>
		</>
	)
}
