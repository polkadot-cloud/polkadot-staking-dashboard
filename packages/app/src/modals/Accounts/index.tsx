// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData, isSupportedProxy } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useProxies } from 'contexts/Proxies'
import { setActiveProxy } from 'global-bus'
import { useTranslation } from 'react-i18next'
import { Accounts as AccountsModal } from 'ui-modals'
import { calculateAllBalances } from 'utils'

export const Accounts = () => {
	const { t } = useTranslation('modals')
	const { network } = useNetwork()
	const { getDelegates } = useProxies()
	const { accounts, getAccount } = useImportedAccounts()
	const { activeEra } = useApi()
	const {
		activeAddress,
		activeAccount,
		activeProxy: activeProxyState,
		activeProxyType,
		setActiveAccount,
	} = useActiveAccounts()
	const {
		getStakingLedger,
		getPoolMembership,
		getAccountBalance,
		getEdReserved,
		feeReserve,
	} = useBalances()
	const { unit, units } = getStakingChainData(network)

	const getTransferableBalance = (address: string): bigint => {
		const accountBalance = getAccountBalance(address)
		const stakingLedger = getStakingLedger(address)
		const { membership } = getPoolMembership(address)
		const edReserved = getEdReserved()
		const balances = calculateAllBalances(
			accountBalance,
			stakingLedger,
			membership,
			edReserved,
			feeReserve,
			activeEra.index,
		)
		return balances.transferableBalance
	}

	return (
		<AccountsModal
			accounts={accounts}
			activeAddress={activeAddress ?? null}
			activeAccount={activeAccount}
			activeProxy={activeProxyState}
			activeProxyType={activeProxyType ?? null}
			setActiveAccount={setActiveAccount}
			setActiveProxy={(n, proxy) => setActiveProxy(n as typeof network, proxy)}
			getDelegates={getDelegates}
			getStakingLedger={getStakingLedger}
			getPoolMembership={getPoolMembership}
			getAccount={getAccount}
			getImportedAccounts={() => accounts}
			getTransferableBalance={getTransferableBalance}
			isSupportedProxy={isSupportedProxy}
			network={network}
			unit={unit}
			units={units}
			t={t}
		/>
	)
}
