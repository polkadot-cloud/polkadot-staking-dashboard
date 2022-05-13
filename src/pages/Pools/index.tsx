// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageProps } from '../types';
import { PageRowWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { PageTitle } from '../../library/PageTitle';
import { StatBoxList } from '../../library/StatBoxList';
import { defaultIfNaN } from '../../Utils';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useApi } from '../../contexts/Api';
import { PoolAccount } from './PoolAccount';
import { Separator } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { Button } from '../../library/Button';
import { PoolList } from '../../library/PoolList';
import { usePools } from '../../contexts/Pools';
import StatBoxListItem from '../../library/StatBoxList/Item';

export const Pools = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { meta } = usePools();
  const { network }: any = useApi();

  const [state] = useState({
    pools: [
      {
        id: 1,
        points: '20,100,000,000,000,000',
        state: 'Open',
        memberCounter: 2,
        roles: {
          depositor: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          root: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          nominator: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          stateToggler: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        },
        addresses: {
          stash: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          reward: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
        },
      },
      {
        id: 2,
        points: '10,100,000,000,000,000',
        state: 'Open',
        memberCounter: 20,
        roles: {
          depositor: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          root: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          nominator: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          stateToggler: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        },
        addresses: {
          stash: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          reward: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        },
      },
    ],
    activePool: 1,
  });

  const totalPools = meta.counterForBondedPools + meta.counterForRewardPools;
  const activePoolsAsPercent = defaultIfNaN(
    ((meta.counterForRewardPools ?? 0) / (totalPools * 0.01)).toFixed(2),
    0
  );
  const activePool = state.pools.find(
    (item: any) => item.id === meta.counterForRewardPools
  );

  const items: any = [
    {
      format: 'chart-pie',
      params: {
        label: 'Active Pools',
        stat: {
          value: meta.counterForRewardPools,
          total: totalPools,
          unit: '',
        },
        graph: {
          value1: meta.counterForRewardPools,
          value2: totalPools - meta.counterForRewardPools,
        },
        tooltip: `${activePoolsAsPercent}%`,
        assistant: {
          page: 'pools',
          key: 'Active Pools',
        },
      },
    },
    {
      format: 'number',
      params: {
        label: 'Minimum Join Bond',
        value: meta.minJoinBond,
        unit: 'DOT',
        assistant: {
          page: 'pools',
          key: 'Era',
        },
      },
    },
    {
      format: 'number',
      params: {
        label: 'Minimum Create Bond',
        value: meta.minCreateBond,
        unit: 'DOT',
        assistant: {
          page: 'pools',
          key: 'Era',
        },
      },
    },
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        {items.map((item: any, index: number) => (
          <StatBoxListItem {...item} key={index} />
        ))}
      </StatBoxList>
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight style={{ flex: 1 }}>
          <SectionWrapper style={{ height: 360 }}>
            <div className="head">
              <h4>
                Status
                <OpenAssistantIcon page="pools" title="Pool Status" />
              </h4>
              <h2>
                Actively in Pool and Earning Rewards &nbsp;
                <div>
                  {activePool === undefined ? (
                    <Button
                      small
                      inline
                      primary
                      title="Create Pool"
                      onClick={() => {}}
                    />
                  ) : (
                    <Button
                      small
                      inline
                      primary
                      title="Leave"
                      onClick={() => {}}
                    />
                  )}
                </div>
              </h2>
              <Separator />
              <h4>
                Bonded in Pool
                <OpenAssistantIcon page="pools" title="Bonded in Pool" />
              </h4>
              <h2>
                32.622931 {network.unit} &nbsp;
                <div>
                  <Button small primary inline title="+" onClick={() => {}} />
                  <Button small primary title="-" onClick={() => {}} />
                </div>
              </h2>
              <Separator />
              <h4>
                Unclaimed Rewards
                <OpenAssistantIcon page="pools" title="Pool Rewards" />
              </h4>
              <h2>
                0.82 {network.unit} &nbsp;
                <div>
                  <Button
                    small
                    primary
                    inline
                    title="Claim"
                    onClick={() => {}}
                  />
                </div>
              </h2>
            </div>
          </SectionWrapper>
        </MainWrapper>
        <SecondaryWrapper>
          <SectionWrapper style={{ height: 360 }}>
            <div className="head">
              <h2>Pool Roles</h2>
              <h4>
                Root <OpenAssistantIcon page="pools" title="Joined Pool" />
              </h4>
              <PoolAccount address={activePool?.roles?.root ?? null} />

              <h4>
                Depositor <OpenAssistantIcon page="pools" title="Joined Pool" />
              </h4>
              <PoolAccount address={activePool?.roles?.depositor ?? null} />

              <h4>
                Nominator <OpenAssistantIcon page="pools" title="Joined Pool" />
              </h4>
              <PoolAccount address={activePool?.roles?.nominator ?? null} />

              <h4>
                State Toggler
                <OpenAssistantIcon page="pools" title="Joined Pool" />
              </h4>
              <PoolAccount
                address={activePool?.roles?.stateToggler ?? null}
                last={true}
              />
            </div>
          </SectionWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <h2>
            Pools
            <OpenAssistantIcon page="pools" title="Nomination Pools" />
          </h2>
          <PoolList
            pools={state.pools}
            title="Active Pools"
            allowMoreCols
            pagination
          />
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Pools;
