// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSyncing } from 'hooks/useSyncing'
import { PageWarnings } from 'library/PageWarnings'
import { Active } from 'pages/Nominate/Active'
import { AverageRewardRate } from 'pages/Overview/Stats/AverageRewardRate'
import { NextRewards } from 'pages/Overview/Stats/NextRewards'
import { PoolOverview } from 'pages/Pools/Overview'
import { MinJoinBond } from 'pages/Pools/Stats/MinJoinBond'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'

export const Stake = () => {
	const { t } = useTranslation('pages')
	const { activeAddress } = useActiveAccounts()
	const { nominatorBalance } = useAccountBalances(activeAddress)
	const { syncing, accountSynced } = useSyncing([
		'initialization',
		'era-stakers',
	])

	let isPreloading = true
	if (activeAddress) {
		isPreloading = syncing || !accountSynced(activeAddress)
	} else {
		isPreloading = syncing
	}

	const nominating = nominatorBalance.isGreaterThan(0)

	return (
		<>
			<Page.Title title={t('stake')} />
			<PageWarnings />
			{!nominating && (
				<Stat.Row>
					<AverageRewardRate isPreloading={isPreloading} />
					<MinJoinBond isPreloading={isPreloading} />
					<NextRewards isPreloading={isPreloading} />
				</Stat.Row>
			)}
			{nominating ? (
				<Active />
			) : (
				<PoolOverview isPreloading={isPreloading} showOtherOptions={true} />
			)}
		</>
	)
}
