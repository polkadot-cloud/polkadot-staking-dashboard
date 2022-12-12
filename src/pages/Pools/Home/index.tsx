// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { Roles } from '../Roles';
import { ClosurePrompts } from './ClosurePrompts';
import { PoolsTabsProvider, usePoolsTabs } from './context';
import { Favorites } from './Favorites';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { Members } from './Members';
import { PoolStats } from './PoolStats';
import ActivePoolsStatBox from './Stats/ActivePools';
import MinCreateBondStatBox from './Stats/MinCreateBond';
import MinJoinBondStatBox from './Stats/MinJoinBond';
import PoolMembershipBox from './Stats/PoolMembership';
import { Status } from './Status';

export const HomeInner = () => {
  const { activeAccount } = useConnect();
  const { bondedPools, getAccountPools } = useBondedPools();
  const { getPoolRoles, selectedActivePool } = useActivePools();
  const { activeTab, setActiveTab } = usePoolsTabs();

  const { openModalWith } = useModal();
  const { t } = useTranslation('pages');

  const accountPools = getAccountPools(activeAccount);
  const totalAccountPools = Object.entries(accountPools).length;

  // back to tab 0 if not in a pool & on members tab
  useEffect(() => {
    if (!selectedActivePool && [1].includes(activeTab)) {
      setActiveTab(0);
    }
  }, [selectedActivePool]);

  const ROW_HEIGHT = 275;

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
            <ActivePoolsStatBox />
            <MinJoinBondStatBox />
            <MinCreateBondStatBox />
          </StatBoxList>

          <ClosurePrompts />

          <PageRowWrapper className="page-padding" noVerticalSpacer>
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
          </PageRowWrapper>
          {selectedActivePool !== null && (
            <>
              <ManagePool />
              <PageRowWrapper className="page-padding" noVerticalSpacer>
                <CardWrapper>
                  <Roles
                    batchKey="pool_roles_manage"
                    defaultRoles={getPoolRoles()}
                  />
                </CardWrapper>
              </PageRowWrapper>
              <PageRowWrapper className="page-padding" noVerticalSpacer>
                <PoolStats />
              </PageRowWrapper>
            </>
          )}
        </>
      )}
      {activeTab === 1 && <Members />}
      {activeTab === 2 && (
        <>
          <StatBoxList>
            <PoolMembershipBox />
            <ActivePoolsStatBox />
            <MinJoinBondStatBox />
          </StatBoxList>
          <PageRowWrapper className="page-padding" noVerticalSpacer>
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
          </PageRowWrapper>
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

export const Home = () => {
  return (
    <PoolsTabsProvider>
      <HomeInner />
    </PoolsTabsProvider>
  );
};

export default Home;
