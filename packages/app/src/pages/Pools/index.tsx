// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListProvider } from 'contexts/List'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useFavoritePools } from 'contexts/Pools/FavoritePools'
import { CardWrapper } from 'library/Card/Wrappers'
import { PoolList } from 'library/PoolList'
import { WithdrawPrompt } from 'library/WithdrawPrompt'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Page, Stat } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { ClosurePrompts } from './ClosurePrompts'
import { PoolFavorites } from './Favorites'
import { ManageBond } from './ManageBond'
import { ManagePool } from './ManagePool'
import { PoolStats } from './PoolStats'
import { Roles } from './Roles'
import { ActivePoolCount } from './Stats/ActivePoolCount'
import { MinCreateBond } from './Stats/MinCreateBond'
import { MinJoinBond } from './Stats/MinJoinBond'
import { Status } from './Status'
import { PoolsTabsProvider, usePoolsTabs } from './context'

export const PoolsInner = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { favorites } = useFavoritePools()
  const { bondedPools } = useBondedPools()
  const { activeTab, setActiveTab } = usePoolsTabs()
  const { getPoolRoles, activePool } = useActivePool()
  const { openCanvas } = useOverlay().canvas
  const location = useLocation()

  const ROW_HEIGHT = 220

  // Handle pool invite navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const poolId = params.get('pool')
    const isInvite = params.get('fromInvite') === 'true'

    if (poolId) {
      setActiveTab(1)
      openCanvas({
        key: 'Pool',
        options: {
          id: poolId,
          fromInvite: isInvite,
          forcePoolId: isInvite ? poolId : undefined,
        },
        size: 'xl',
      })
    }
  }, [location])

  // Go back to tab 0 on network change.
  useEffect(() => {
    setActiveTab(0)
  }, [network])

  return (
    <>
      <Page.Title
        title={t('pools')}
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
      {activeTab === 0 && (
        <>
          <Stat.Row>
            <ActivePoolCount />
            <MinJoinBond />
            <MinCreateBond />
          </Stat.Row>
          <ClosurePrompts />
          <WithdrawPrompt bondFor="pool" />
          <Page.Row>
            <Page.RowSection secondary vLast>
              <CardWrapper height={ROW_HEIGHT}>
                <ManageBond />
              </CardWrapper>
            </Page.RowSection>
            <Page.RowSection hLast>
              <Status height={ROW_HEIGHT} />
            </Page.RowSection>
          </Page.Row>
          {activePool !== null && (
            <>
              <ManagePool />
              <Page.Row>
                <CardWrapper>
                  <Roles defaultRoles={getPoolRoles()} />
                </CardWrapper>
              </Page.Row>
              <Page.Row>
                <PoolStats />
              </Page.Row>
            </>
          )}
        </>
      )}
      {activeTab === 1 && (
        <Page.Row>
          <CardWrapper>
            <ListProvider>
              <PoolList
                pools={bondedPools}
                itemsPerPage={30}
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
