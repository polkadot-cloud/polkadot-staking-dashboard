// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useApi } from 'contexts/Api';
import { PoolList } from 'library/PoolList';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { BondedPoolsContextState } from 'types/pools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import ActivePoolsStatBox from './Stats/ActivePools';
import MinJoinBondStatBox from './Stats/MinJoinBond';
import PoolMembershipBox from './Stats/PoolMembership';
import MinCreateBondStatBox from './Stats/MinCreateBond';
import { Status } from './Status';
import { ManageBond } from './ManageBond';
import { ManagePool } from './ManagePool';
import { PageProps } from '../types';
import { Roles } from './Roles';
import { PoolsTabsProvider, usePoolsTabs } from './context';

export const PoolsInner = (props: PageProps) => {
  const { page } = props;
  const { title } = page;
  const { network } = useApi();
  const navigate = useNavigate();
  const { bondedPools } = useBondedPools() as BondedPoolsContextState;
  const { isBonding } = useActivePool();
  const { activeTab, setActiveTab } = usePoolsTabs();

  // back to overview if pools are not supported on network
  useEffect(() => {
    if (!network.features.pools) {
      navigate('/#/overview', { replace: true });
    }
  }, [network]);

  return (
    <>
      <PageTitle
        title={title}
        tabs={[
          {
            title: 'Overview',
            active: activeTab === 0,
            onClick: () => setActiveTab(0),
          },
          {
            title: 'All Pools',
            active: activeTab === 1,
            onClick: () => setActiveTab(1),
          },
        ]}
      />
      {activeTab === 0 && (
        <>
          <StatBoxList>
            <ActivePoolsStatBox />
            <MinJoinBondStatBox />
            <MinCreateBondStatBox />
          </StatBoxList>
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <RowPrimaryWrapper hOrder={1} vOrder={0}>
              <Status />
            </RowPrimaryWrapper>
            <RowSecondaryWrapper hOrder={0} vOrder={1}>
              <CardWrapper height={300}>
                <ManageBond />
              </CardWrapper>
            </RowSecondaryWrapper>
          </PageRowWrapper>
          {isBonding() && (
            <>
              <ManagePool />
              <PageRowWrapper className="page-padding" noVerticalSpacer>
                <CardWrapper>
                  <Roles />
                </CardWrapper>
              </PageRowWrapper>
            </>
          )}
        </>
      )}
      {activeTab === 1 && (
        <>
          <StatBoxList>
            <PoolMembershipBox />
            <ActivePoolsStatBox />
            <MinJoinBondStatBox />
          </StatBoxList>
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <CardWrapper>
              <CardHeaderWrapper>
                <h2>
                  All Pools
                  <OpenAssistantIcon page="pools" title="Nomination Pools" />
                </h2>
              </CardHeaderWrapper>
              <PoolList
                pools={bondedPools}
                title="Active Pools"
                allowMoreCols
                pagination
              />
            </CardWrapper>
          </PageRowWrapper>
        </>
      )}
    </>
  );
};

export const Pools = (props: PageProps) => {
  return (
    <PoolsTabsProvider>
      <PoolsInner {...props} />
    </PoolsTabsProvider>
  );
};

export default Pools;
