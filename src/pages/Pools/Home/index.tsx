// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { useApi } from 'contexts/Api';
import { PoolList } from 'library/PoolList';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import {
  SECTION_FULL_WIDTH_THRESHOLD,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import ActivePoolsStatBox from './Stats/ActivePools';
import MinJoinBondStatBox from './Stats/MinJoinBond';
import PoolMembershipBox from './Stats/PoolMembership';
import MinCreateBondStatBox from './Stats/MinCreateBond';
import { Status } from './Status';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { PageProps } from '../../types';
import { Roles } from '../Roles';
import { PoolsTabsProvider, usePoolsTabs } from './context';
import { Favourites } from './Favourites';
import { Members } from './Members';

export const HomeInner = (props: PageProps) => {
  const { page } = props;
  const { title } = page;
  const { network } = useApi();
  const navigate = useNavigate();
  const { bondedPools } = useBondedPools();
  const { isBonding, getPoolRoles, activeBondedPool } = useActivePool();
  const { activeTab, setActiveTab } = usePoolsTabs();

  // back to overview if pools are not supported on network
  useEffect(() => {
    if (!network.features.pools) {
      navigate('/#/overview', { replace: true });
    }
  }, [network]);

  // back to tab 0 if not in a pool
  useEffect(() => {
    if (!activeBondedPool) {
      setActiveTab(0);
    }
  }, [activeBondedPool]);

  const ROW_HEIGHT = 275;

  let tabs = [
    {
      title: 'Overview',
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  if (activeBondedPool) {
    tabs = tabs.concat({
      title: 'Members',
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    });
  }

  tabs = tabs.concat(
    {
      title: 'All Pools',
      active: activeTab === 2,
      onClick: () => setActiveTab(2),
    },
    {
      title: 'Favourites',
      active: activeTab === 3,
      onClick: () => setActiveTab(3),
    }
  );

  return (
    <>
      <PageTitle title={title} tabs={tabs} />
      {activeTab === 0 && (
        <>
          <StatBoxList>
            <ActivePoolsStatBox />
            <MinJoinBondStatBox />
            <MinCreateBondStatBox />
          </StatBoxList>
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
          {isBonding() && (
            <>
              <ManagePool />
              <PageRowWrapper className="page-padding" noVerticalSpacer>
                <CardWrapper>
                  <Roles
                    batchKey="pool_roles_manage"
                    title="Roles"
                    defaultRoles={getPoolRoles()}
                  />
                </CardWrapper>
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
                title="Active Pools"
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
          <Favourites />
        </>
      )}
    </>
  );
};

export const Home = (props: PageProps) => {
  return (
    <PoolsTabsProvider>
      <HomeInner {...props} />
    </PoolsTabsProvider>
  );
};

export default Home;
