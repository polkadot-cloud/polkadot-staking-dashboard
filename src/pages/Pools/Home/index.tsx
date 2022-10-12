// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { PoolList } from 'library/PoolList';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import {
  SECTION_FULL_WIDTH_THRESHOLD,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';

import { useTranslation } from 'react-i18next';
import { useModal } from 'contexts/Modal';
import { useConnect } from 'contexts/Connect';
import ActivePoolsStatBox from './Stats/ActivePools';
import MinJoinBondStatBox from './Stats/MinJoinBond';
import PoolMembershipBox from './Stats/PoolMembership';
import MinCreateBondStatBox from './Stats/MinCreateBond';
import { Status } from './Status';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { Roles } from '../Roles';
import { PoolsTabsProvider, usePoolsTabs } from './context';
import { Favorites } from './Favorites';
import { Members } from './Members';
import { ClosurePrompts } from './ClosurePrompts';
import { PoolStats } from './PoolStats';

export const HomeInner = () => {
  const { activeAccount } = useConnect();
  const { bondedPools, getAccountPools } = useBondedPools();
  const { getPoolRoles, selectedActivePool } = useActivePools();
  const { activeTab, setActiveTab } = usePoolsTabs();
  const { t } = useTranslation('common');
  const { openModalWith } = useModal();

  const accountPools = getAccountPools(activeAccount);
  const totalAccountPools = Object.entries(accountPools).length;

  // back to tab 0 if not in a pool
  useEffect(() => {
    if (!selectedActivePool) {
      setActiveTab(0);
    }
  }, [selectedActivePool]);

  const ROW_HEIGHT = 275;

  let tabs = [
    {
      title: t('pages.pools.overview'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  if (selectedActivePool) {
    tabs = tabs.concat({
      title: t('pages.pools.members'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    });
  }

  tabs = tabs.concat(
    {
      title: t('pages.pools.all_pools'),
      active: activeTab === 2,
      onClick: () => setActiveTab(2),
    },
    {
      title: t('pages.pools.favorites'),
      active: activeTab === 3,
      onClick: () => setActiveTab(3),
    }
  );

  return (
    <>
      <PageTitle
        title={t('pages.pools.pools')}
        tabs={tabs}
        button={
          totalAccountPools
            ? {
              title: t('pages.pools.all_roles'),
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
              thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
              thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
            >
              <Status height={ROW_HEIGHT} />
            </RowPrimaryWrapper>
            <RowSecondaryWrapper
              hOrder={0}
              vOrder={1}
              thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
              thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
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
                title={t('pages.pools.active_pools')}
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
