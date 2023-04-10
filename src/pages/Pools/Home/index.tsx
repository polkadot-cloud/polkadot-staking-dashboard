// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow } from '@polkadotcloud/core-ui';
import { RowPrimaryWrapper, RowSecondaryWrapper } from 'Wrappers';
import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { PoolList } from 'library/PoolList';
import { StatBoxList } from 'library/StatBoxList';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Roles } from '../Roles';
import { ClosurePrompts } from './ClosurePrompts';
import { Favorites } from './Favorites';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { Members } from './Members';
import { PoolStats } from './PoolStats';
import { ActivePoolsStat } from './Stats/ActivePools';
import { MinCreateBondStat } from './Stats/MinCreateBond';
import { MinJoinBondStat } from './Stats/MinJoinBond';
import { PoolMembershipStat } from './Stats/PoolMembership';
import { Status } from './Status';
import { PoolsTabsProvider, usePoolsTabs } from './context';

export const HomeInner = () => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useConnect();
  const { bondedPools, getAccountPools } = useBondedPools();
  const { getPoolRoles, selectedActivePool } = useActivePools();
  const { activeTab, setActiveTab } = usePoolsTabs();
  const { openModalWith } = useModal();

  const accountPools = getAccountPools(activeAccount);
  const totalAccountPools = Object.entries(accountPools).length;

  // back to tab 0 if not in a pool & on members tab
  useEffect(() => {
    if (!selectedActivePool && [1].includes(activeTab)) {
      setActiveTab(0);
    }
  }, [selectedActivePool]);

  const ROW_HEIGHT = 220;

  let tabs = [
    {
      title: t('pools.overview'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  if (selectedActivePool) {
    tabs = tabs.concat({
      title: t('pools.members'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    });
  }

  tabs = tabs.concat(
    {
      title: t('pools.allPools'),
      active: activeTab === 2,
      onClick: () => setActiveTab(2),
    },
    {
      title: t('pools.favorites'),
      active: activeTab === 3,
      onClick: () => setActiveTab(3),
    }
  );

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
                  openModalWith('AccountPoolRoles', { who: activeAccount }),
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

          <PageRow noVerticalMargin>
            <RowPrimaryWrapper
              hOrder={1}
              vOrder={0}
              thresholdStickyMenu={SideMenuStickyThreshold}
              thresholdFullWidth={SectionFullWidthThreshold}
            >
              <Status height={ROW_HEIGHT} />
            </RowPrimaryWrapper>
            <RowSecondaryWrapper
              hOrder={0}
              vOrder={1}
              thresholdStickyMenu={SideMenuStickyThreshold}
              thresholdFullWidth={SectionFullWidthThreshold}
            >
              <CardWrapper height={ROW_HEIGHT}>
                <ManageBond />
              </CardWrapper>
            </RowSecondaryWrapper>
          </PageRow>
          {selectedActivePool !== null && (
            <>
              <ManagePool />
              <PageRow noVerticalMargin>
                <CardWrapper>
                  <Roles
                    batchKey="pool_roles_manage"
                    defaultRoles={getPoolRoles()}
                  />
                </CardWrapper>
              </PageRow>
              <PageRow noVerticalMargin>
                <PoolStats />
              </PageRow>
            </>
          )}
        </>
      )}
      {activeTab === 1 && <Members />}
      {activeTab === 2 && (
        <>
          <StatBoxList>
            <PoolMembershipStat />
            <ActivePoolsStat />
            <MinJoinBondStat />
          </StatBoxList>
          <PageRow noVerticalMargin>
            <CardWrapper>
              <PoolList
                batchKey="bonded_pools"
                pools={bondedPools}
                title={t('pools.activePools')}
                defaultFilters={{
                  includes: ['active'],
                  excludes: ['locked', 'destroying'],
                }}
                allowMoreCols
                allowSearch
                pagination
              />
            </CardWrapper>
          </PageRow>
        </>
      )}
      {activeTab === 3 && (
        <>
          <Favorites />
        </>
      )}
    </>
  );
};

export const Home = () => (
  <PoolsTabsProvider>
    <HomeInner />
  </PoolsTabsProvider>
);
