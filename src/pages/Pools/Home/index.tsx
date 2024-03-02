// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { CardWrapper } from 'library/Card/Wrappers';
import { PoolList } from 'library/PoolList/Default';
import { StatBoxList } from 'library/StatBoxList';
import { useFavoritePools } from 'contexts/Pools/FavoritePools';
import { useOverlay } from 'kits/Overlay/Provider';
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
import { useActivePools } from 'hooks/useActivePools';
import { useBalances } from 'contexts/Balances';
import { PageTitle } from 'kits/Structure/PageTitle';
import type { PageTitleTabProps } from 'kits/Structure/PageTitleTabs/types';
import { PageRow } from 'kits/Structure/PageRow';
import { RowSection } from 'kits/Structure/RowSection';
import { WithdrawPrompt } from 'library/WithdrawPrompt';

export const HomeInner = () => {
  const { t } = useTranslation('pages');
  const { favorites } = useFavoritePools();
  const { openModal } = useOverlay().modal;
  const { bondedPools } = useBondedPools();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { activeTab, setActiveTab } = usePoolsTabs();
  const { getPoolRoles, activePool } = useActivePool();
  const { counterForBondedPools } = useApi().poolsConfig;

  const membership = getPoolMembership(activeAccount);
  const { state } = activePool?.bondedPool || {};

  const { activePools } = useActivePools({
    poolIds: '*',
  });

  const activePoolsNoMembership = { ...activePools };
  delete activePoolsNoMembership[membership?.poolId || -1];

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
    if (!activePool) {
      setActiveTab(0);
    }
  }, [activePool]);

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle
        title={t('pools.pools')}
        tabs={tabs}
        button={
          Object.keys(activePoolsNoMembership).length > 0
            ? {
                title: t('pools.allRoles'),
                onClick: () =>
                  openModal({
                    key: 'AccountPoolRoles',
                    options: { who: activeAccount, activePools },
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

          {state === 'Destroying' ? (
            <ClosurePrompts />
          ) : (
            <WithdrawPrompt bondFor="pool" />
          )}

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
