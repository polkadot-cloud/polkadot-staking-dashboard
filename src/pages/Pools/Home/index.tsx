// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageRow, PageTitle, RowSection } from '@polkadot-cloud/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PageTitleTabProps } from '@polkadot-cloud/react/types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { CardWrapper } from 'library/Card/Wrappers';
import { PoolList } from 'library/PoolList/Default';
import { StatBoxList } from 'library/StatBoxList';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { PoolListProvider } from 'library/PoolList/context';
import { Roles } from '../Roles';
import { ClosurePrompts } from './ClosurePrompts';
import { PoolFavorites } from './Favorites';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { PoolStats } from './PoolStats';
import { ActivePoolsStat } from './Stats/ActivePools';
import { MinCreateBondStat } from './Stats/MinCreateBond';
import { MinJoinBondStat } from './Stats/MinJoinBond';
import { Status } from './Status';
import { PoolsTabsProvider, usePoolsTabs } from './context';
import { useApi } from 'contexts/Api';

export const HomeInner = () => {
  const { t } = useTranslation('pages');
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { favorites } = usePoolsConfig();
  const { activeTab, setActiveTab } = usePoolsTabs();
  const { counterForBondedPools } = useApi().poolsConfig;
  const { bondedPools, getAccountPools } = useBondedPools();
  const { getPoolRoles, selectedActivePool } = useActivePools();
  const accountPools = getAccountPools(activeAccount);
  const totalAccountPools = Object.entries(accountPools).length;

  let tabs: PageTitleTabProps[] = [
    {
      title: t('pools.overview'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  tabs = tabs.concat(
    {
      title: t('pools.allPools'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
      badge: String(counterForBondedPools.toString()),
    },
    {
      title: t('pools.favorites'),
      active: activeTab === 2,
      onClick: () => setActiveTab(2),
      badge: String(favorites.length),
    }
  );

  // Back to tab 0 if not in a pool & on members tab.
  useEffect(() => {
    if (!selectedActivePool) {
      setActiveTab(0);
    }
  }, [selectedActivePool]);

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle
        title={t('pools.pools')}
        tabs={tabs}
        button={
          totalAccountPools
            ? {
                title: t('pools.allRoles'),
                onClick: () =>
                  openModal({
                    key: 'AccountPoolRoles',
                    options: { who: activeAccount },
                  }),
              }
            : undefined
        }
      />
      {activeTab === 0 && (
        <>
          <StatBoxList>
            <ActivePoolsStat />
            <MinJoinBondStat />
            <MinCreateBondStat />
          </StatBoxList>

          <ClosurePrompts />

          <PageRow>
            <RowSection hLast>
              <Status height={ROW_HEIGHT} />
            </RowSection>
            <RowSection secondary>
              <CardWrapper height={ROW_HEIGHT}>
                <ManageBond />
              </CardWrapper>
            </RowSection>
          </PageRow>
          {selectedActivePool !== null && (
            <>
              <ManagePool />
              <PageRow>
                <CardWrapper>
                  <Roles
                    batchKey="pool_roles_manage"
                    defaultRoles={getPoolRoles()}
                  />
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
                defaultFilters={{
                  includes: ['active'],
                  excludes: ['locked', 'destroying'],
                }}
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
  );
};

export const Home = () => (
  <PoolsTabsProvider>
    <HomeInner />
  </PoolsTabsProvider>
);
