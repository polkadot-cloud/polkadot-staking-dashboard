// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useFavoritePools } from 'contexts/Pools/FavoritePools'
import { CardWrapper } from 'library/Card/Wrappers'
import { PoolList } from 'library/PoolList'
import { PoolListProvider } from 'library/PoolList/context'
import { StatBoxList } from 'library/StatBoxList'
import { WithdrawPrompt } from 'library/WithdrawPrompt'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageRow, PageTitle, RowSection } from 'ui-structure'
import { ClosurePrompts } from './ClosurePrompts'
import { PoolFavorites } from './Favorites'
import { ManageBond } from './ManageBond'
import { ManagePool } from './ManagePool'
import { PoolStats } from './PoolStats'
import { Roles } from './Roles'
import { ActivePoolsStat } from './Stats/ActivePools'
import { MinCreateBondStat } from './Stats/MinCreateBond'
import { MinJoinBondStat } from './Stats/MinJoinBond'
import { Status } from './Status'
import { PoolsTabsProvider, usePoolsTabs } from './context'

export const PoolsInner = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { favorites } = useFavoritePools()
  const { bondedPools } = useBondedPools()
  const { activeTab, setActiveTab } = usePoolsTabs()
  const { getPoolRoles, activePool } = useActivePool()

  const ROW_HEIGHT = 220

  // Go back to tab 0 on network change.
  useEffect(() => {
    setActiveTab(0)
  }, [network])

  return (
    <>
      <PageTitle
        title={t('pools.pools')}
        tabs={[
          {
            title: t('pools.overview'),
            active: activeTab === 0,
            onClick: () => setActiveTab(0),
          },
          {
            title: t('pools.allPools'),
            active: activeTab === 1,
            onClick: () => setActiveTab(1),
          },
          {
            title: t('pools.favorites'),
            active: activeTab === 2,
            onClick: () => setActiveTab(2),
            badge: String(favorites.length),
          },
        ]}
      />
      {activeTab === 0 && (
        <>
          <StatBoxList>
            <ActivePoolsStat />
            <MinJoinBondStat />
            <MinCreateBondStat />
          </StatBoxList>
          <ClosurePrompts />
          <WithdrawPrompt bondFor="pool" />
          <PageRow>
            <RowSection secondary vLast>
              <CardWrapper height={ROW_HEIGHT}>
                <ManageBond />
              </CardWrapper>
            </RowSection>
            <RowSection hLast>
              <Status height={ROW_HEIGHT} />
            </RowSection>
          </PageRow>
          {activePool !== null && (
            <>
              <ManagePool />
              <PageRow>
                <CardWrapper>
                  <Roles defaultRoles={getPoolRoles()} />
                </CardWrapper>
              </PageRow>
              <PageRow>
                <PoolStats />
              </PageRow>
            </>
          )}
        </>
      )}
      {activeTab === 1 && (
        <PageRow>
          <CardWrapper>
            <PoolListProvider>
              <PoolList
                pools={bondedPools}
                allowMoreCols
                allowSearch
                pagination
              />
            </PoolListProvider>
          </CardWrapper>
        </PageRow>
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
