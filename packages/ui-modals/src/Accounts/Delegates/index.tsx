// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountsProps, DelegatesProps, ProxyDelegate } from '../types'
import { DelegateItem } from './DelegateItem'
import classes from './index.module.scss'

type DelegatesComponentProps = DelegatesProps &
	Pick<
		AccountsProps,
		| 'activeAccount'
		| 'activeProxy'
		| 'activeAddress'
		| 'activeProxyType'
		| 'getAccount'
		| 'getImportedAccounts'
		| 'getTransferableBalance'
		| 'setActiveAccount'
		| 'setActiveProxy'
		| 'isSupportedProxy'
		| 'network'
		| 'unit'
		| 'units'
		| 't'
	> & {
		closeModal: () => void
	}

export const Delegates = ({
	delegates,
	source,
	delegator,
	getImportedAccounts,
	isSupportedProxy,
	...rest
}: DelegatesComponentProps) => {
	const accounts = getImportedAccounts()

	// Filter delegates that are external or not imported. Default to empty array if there are no
	// delegates for this address.
	const delegatesList = (delegates?.delegates.filter(
		({ delegate, proxyType }: ProxyDelegate) =>
			accounts.find(({ address }) => address === delegate) !== undefined &&
			isSupportedProxy(proxyType) &&
			accounts.find(({ address }) => address === delegate)?.source !==
				'external',
	) || []) as ProxyDelegate[]

	return delegatesList.length ? (
		<div className={classes.delegatesWrapper}>
			{delegatesList.map(({ delegate, proxyType }, i) => (
				<DelegateItem
					key={`_del_${i}`}
					delegator={delegator}
					proxyType={proxyType}
					delegate={delegate}
					getImportedAccounts={getImportedAccounts}
					{...rest}
				/>
			))}
		</div>
	) : null
}
