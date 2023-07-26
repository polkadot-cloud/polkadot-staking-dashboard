// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow, PageTitle, RowSection } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useSubscan } from 'contexts/Subscan';
import { CardWrapper } from 'library/Card/Wrappers';
import { PoolList } from 'library/PoolList/Default';
import { StatBoxList } from 'library/StatBoxList';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Roles } from '../Roles';
import { ClosurePrompts } from './ClosurePrompts';
import { PoolFavorites } from './Favorites';
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
  const { pluginEnabled } = usePlugins();
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { fetchPoolDetails } = useSubscan();
  const { membership } = usePoolMemberships();
  const { activeTab, setActiveTab } = usePoolsTabs();
  const { bondedPools, getAccountPools } = useBondedPools();
  const { getPoolRoles, selectedActivePool } = useActivePools();
  const { getMembersOfPoolFromNode, poolMembersNode } = usePoolMembers();
  const accountPools = getAccountPools(activeAccount);
  const totalAccountPools = Object.entries(accountPools).length;

  const fetchingMemberCount = useRef<boolean>(false);

  const getMemberCount = async () => {
    if (!selectedActivePool?.id) {
      setMemberCount(0);
      return;
    }
    if (pluginEnabled('subscan') && !fetchingMemberCount.current) {
      fetchingMemberCount.current = true;
      const poolDetails = await fetchPoolDetails(selectedActivePool.id);
      fetchingMemberCount.current = false;
      return setMemberCount(poolDetails?.member_count || 0);
    }
    setMemberCount(
      getMembersOfPoolFromNode(selectedActivePool?.id ?? 0).length
    );
  };

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

  // Store the pool member count.
  const [memberCount, setMemberCount] = useState<number>(0);

  // Back to tab 0 if not in a pool & on members tab.
  useEffect(() => {
    if (!selectedActivePool && [1].includes(activeTab)) {
      setActiveTab(0);
    }
  }, [selectedActivePool]);

  // Fetch pool member count. We use `membership` as a dependency as the member count could change
  // in the UI when active account's membership changes.
  useEffect(() => {
    getMemberCount();
  }, [activeAccount, selectedActivePool, membership, poolMembersNode]);

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
                <PoolStats memberCount={memberCount} />
              </PageRow>
            </>
          )}
        </>
      )}
      {activeTab === 1 && <Members memberCount={memberCount} />}
      {activeTab === 2 && (
        <>
          <StatBoxList>
            <PoolMembershipStat />
            <ActivePoolsStat />
            <MinJoinBondStat />
          </StatBoxList>
          <PageRow>
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
          <PoolFavorites />
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
