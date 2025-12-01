// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListProvider } from 'contexts/List'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useFavoritePools } from 'contexts/Pools/FavoritePools'
import { CardWrapper } from 'library/Card/Wrappers'
import { PageTabs } from 'library/PageTabs'
import { PoolList } from 'library/PoolList'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { PoolsTabsProvider, usePoolsTabs } from './context'
import { PoolFavorites } from './Favorites'
import { PoolOverview } from './Overview'
import { ActivePoolCount } from './Stats/ActivePoolCount'
import { MinCreateBond } from './Stats/MinCreateBond'
import { MinJoinBond } from './Stats/MinJoinBond'

export const PoolsInner = () => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { favorites } = useFavoritePools()
	const { bondedPools } = useBondedPools()
	const { activeTab, setActiveTab } = usePoolsTabs()

	// Go back to tab 0 on network change.
	useEffect(() => {
		setActiveTab(0)
	}, [network])

	return (
		<>
			<Page.Title title={t('pools')}>
				<PageTabs
					tabs={[
						{
							title: t('overview'),
							active: activeTab === 0,
							onClick: () => setActiveTab(0),
						},
						{
							title: t('allPools'),
							active: activeTab === 1,
							onClick: () => setActiveTab(1),
						},
						{
							title: t('favorites'),
							active: activeTab === 2,
							onClick: () => setActiveTab(2),
							badge: String(favorites.length),
						},
					]}
				/>
			</Page.Title>
			{activeTab === 0 && (
				<>
					<Stat.Row>
						<ActivePoolCount />
						<MinJoinBond />
						<MinCreateBond />
					</Stat.Row>
					<PoolOverview />
				</>
			)}
			{activeTab === 1 && (
				<Page.Row>
					<CardWrapper>
						<ListProvider>
							<PoolList
								pools={bondedPools}
								itemsPerPage={50}
								allowMoreCols
								allowSearch
							/>
						</ListProvider>
					</CardWrapper>
				</Page.Row>
			)}
			{activeTab === 2 && <PoolFavorites />}
		</>
	)
}

export const Pools = () => (
	<PoolsTabsProvider>
		<PoolsInner />
	</PoolsTabsProvider>
)
