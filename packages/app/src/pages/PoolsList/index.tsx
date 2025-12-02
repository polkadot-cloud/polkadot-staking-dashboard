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
import { Page } from 'ui-core/base'
import { PoolsTabsProvider, usePoolsTabs } from './context'
import { PoolFavorites } from './Favorites'

const PoolsListInner = () => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { favorites } = useFavoritePools()
	const { bondedPools } = useBondedPools()
	const { activeTab, setActiveTab } = usePoolsTabs()

	// Go back to tab 0 on network change
	useEffect(() => {
		setActiveTab(0)
	}, [network])

	return (
		<>
			<Page.Title title={t('pools', { ns: 'app' })}>
				<PageTabs
					tabs={[
						{
							title: t('overview'),
							active: activeTab === 0,
							onClick: () => setActiveTab(0),
						},
						{
							title: t('favorites'),
							active: activeTab === 1,
							onClick: () => setActiveTab(1),
							badge: String(favorites.length),
						},
					]}
				/>
			</Page.Title>
			{activeTab === 0 && (
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
			{activeTab === 1 && <PoolFavorites />}
		</>
	)
}

export const PoolsList = () => (
	<PoolsTabsProvider>
		<PoolsListInner />
	</PoolsTabsProvider>
)
