// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAccountBalances } from 'hooks/useAccountBalances'
import { AccountButton } from '../AccountButton'

export const DelegateItem = ({
	delegator,
	proxyType,
	source,
	delegate,
}: {
	delegator: string
	proxyType: string
	source: string
	delegate: string
}) => {
	const {
		balances: { transferableBalance },
	} = useAccountBalances(delegate)

	return (
		<AccountButton
			transferableBalance={transferableBalance}
			address={delegate}
			source={source}
			delegator={delegator}
			proxyType={proxyType}
		/>
	)
}
