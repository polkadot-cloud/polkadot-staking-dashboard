// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountButton } from '../AccountButton'
import type { AccountsProps } from '../types'

type DelegateItemProps = Pick<
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
	| 'network'
	| 'unit'
	| 'units'
	| 't'
> & {
	delegator: string
	proxyType: string
	delegate: string
	closeModal: () => void
}

export const DelegateItem = ({
	delegator,
	proxyType,
	delegate,
	getImportedAccounts,
	getTransferableBalance,
	...rest
}: DelegateItemProps) => {
	const accounts = getImportedAccounts()
	const transferableBalance = getTransferableBalance(delegate)

	// Use the delegate's actual source rather than the delegator's source. The delegator may be an
	// external/read-only account, but the delegate (proxy) needs its real source to be recognized
	// as an imported account that can sign transactions.
	const delegateAccount = accounts.find(({ address }) => address === delegate)
	const delegateSource = delegateAccount?.source || 'external'

	return (
		<AccountButton
			transferableBalance={transferableBalance}
			address={delegate}
			source={delegateSource}
			delegator={delegator}
			proxyType={proxyType}
			{...rest}
		/>
	)
}
