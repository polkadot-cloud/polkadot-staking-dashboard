// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment } from 'react'
import { AccountButton } from './AccountButton'
import { Delegates } from './Delegates'
import type { AccountsProps, ProxyInfo } from './types'

type AccountItemComponentProps = {
	source: string
	address: string
	delegates?: ProxyInfo
} & Pick<
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

export const AccountItem = ({
	source,
	address,
	delegates,
	getTransferableBalance,
	...rest
}: AccountItemComponentProps) => {
	const transferableBalance = getTransferableBalance(address)

	return (
		<Fragment>
			<AccountButton
				transferableBalance={transferableBalance}
				address={address}
				source={source}
				{...rest}
			/>
			{address && (
				<Delegates
					delegator={address}
					source={source}
					delegates={delegates}
					getTransferableBalance={getTransferableBalance}
					{...rest}
				/>
			)}
		</Fragment>
	)
}
