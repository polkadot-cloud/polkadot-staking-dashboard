// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { ActionItem } from 'library/ActionItem'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomHeader, Padding } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { AccountItem } from './AccountItem'
import type {
	AccountInPoolProps,
	AccountItemProps,
	AccountNominatingInPoolProps,
} from './types'
import { AccountSeparator, AccountWrapper } from './Wrappers'

export const Accounts = () => {
	const { t } = useTranslation('modals')
	const { getDelegates } = useProxies()
	const { accounts } = useImportedAccounts()
	const { activeAddress, activeProxy } = useActiveAccounts()
	const { getStakingLedger, getPoolMembership } = useBalances()
	const { status: modalStatus, setModalResize } = useOverlay().modal

	// construct account groupings
	const nominating: AccountItemProps[] = []
	const inPool: AccountInPoolProps[] = []
	const nominatingAndPool: AccountNominatingInPoolProps[] = []
	const notStaking: AccountItemProps[] = []

	for (const { address, source } of accounts) {
		const { ledger } = getStakingLedger(address)
		const { membership } = getPoolMembership(address)

		let isNominating = false
		let isInPool = false
		const delegates = getDelegates(address)

		// Inject transferrable balance into delegates list.
		if (delegates?.delegates) {
			delegates.delegates = delegates?.delegates.map((d) => ({
				...d,
			}))
		}

		// Check if nominating
		// Now also checks source to allow same address from multiple sources
		if (
			!!ledger &&
			nominating.find((a) => a.address === address && a.source === source) ===
				undefined
		) {
			isNominating = true
		}

		// Check if in pool
		// Now also checks source to allow same address from multiple sources
		if (membership) {
			if (!inPool.find((n) => n.address === address && n.source === source)) {
				isInPool = true
			}
		}

		// If not doing anything, add address to `notStaking`
		// Now also checks source to allow same address from multiple sources
		if (
			!isNominating &&
			!membership &&
			!notStaking.find((n) => n.address === address && n.source === source)
		) {
			notStaking.push({ address, source, delegates })
			continue
		}

		// If both nominating and in pool, add to this list.
		// Now also checks source to allow same address from multiple sources
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

	// Resize if modal open upon state changes.
	useEffect(() => {
		if (modalStatus === 'open') {
			setModalResize()
		}
	}, [
		accounts,
		activeAddress,
		activeProxy,
		JSON.stringify(nominating.map((n) => n.address?.toString())),
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
					<AccountWrapper style={{ marginTop: '1.5rem' }}>
						<div>
							<div>
								<h4 style={{ padding: '0.75rem 1rem' }}>
									{t('noActiveAccount')}
								</h4>
							</div>
							<div />
						</div>
					</AccountWrapper>
				)}
				{!!nominatingAndPool.length && (
					<>
						<AccountSeparator />
						<ActionItem text={t('nominatingAndInPool')} />
						{nominatingAndPool.map((item, i) => (
							<AccountItem key={`acc_nominating_and_pool_${i}`} {...item} />
						))}
					</>
				)}
				{!!nominating.length && (
					<>
						<AccountSeparator />
						<ActionItem text={t('nominating')} />
						{nominating.map((item, i) => (
							<AccountItem key={`acc_nominating_${i}`} {...item} />
						))}
					</>
				)}
				{!!inPool.length && (
					<>
						<AccountSeparator />
						<ActionItem text={t('inPool')} />
						{inPool.map((item, i) => (
							<AccountItem key={`acc_in_pool_${i}`} {...item} />
						))}
					</>
				)}
				{!!notStaking.length && (
					<>
						<AccountSeparator />
						<ActionItem text={t('notStaking')} />
						{notStaking.map((item, i) => (
							<AccountItem key={`acc_not_staking_${i}`} {...item} />
						))}
					</>
				)}
			</Padding>
		</>
	)
}
