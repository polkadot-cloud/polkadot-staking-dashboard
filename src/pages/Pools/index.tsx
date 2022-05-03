// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
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

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { network }: any = useApi();

  const [state] = useState({
    activePools: 5,
    totalPools: 10,
    minJoinBond: 10,
    minCreateBond: 10,
    pools: [
      {
        points: '20,100,000,000,000,000',
        state: 'Open',
        memberCounter: 2,
        roles: {
          depositor: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          root: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          nominator: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
          stateToggler: '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3',
        }
      }
    ],
    activePool: {
      address: ''
    }
  });

  let activePoolsAsPercent = defaultIfNaN(((state.activePools ?? 0) / (state.totalPools * 0.01)).toFixed(2), 0);

  const items: any = [
    {
      label: "Active Pools",
      value: state.activePools,
      value2: state.totalPools - state.activePools,
      total: state.totalPools,
      unit: "",
      tooltip: `${activePoolsAsPercent}%`,
      format: "chart-pie",
      assistant: {
        page: 'pools',
        key: 'Active Pools'
      }
    }, {
      label: "Minimum Join Bond",
      value: state.minJoinBond,
      unit: "DOT",
      format: "number",
      assistant: {
        page: 'pools',
        key: 'Era',
      }
    }, {
      label: "Minimum Create Bond",
      value: state.minCreateBond,
      unit: "DOT",
      format: "number",
      assistant: {
        page: 'pools',
        key: 'Era',
      }
    }
  ];

  return (
    <>
      <PageTitle title={`Nomination ${title}`} />
      <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight style={{ flex: 1 }}>
          <SectionWrapper style={{ height: 200 }}>
            <div className='head'>
              <h4>
                Status
                <OpenAssistantIcon page='stake' title='Staking Status' />
              </h4>
              <h2>Actively in Pool and Earning Rewards</h2>
              <Separator />
              <h4>
                Bonded in Pool
                <OpenAssistantIcon page='stake' title='Staking Status' />
              </h4>
              <h2>
                32.622931 {network.unit} &nbsp;
                <div>
                  <Button small primary inline title='+' onClick={() => { }} />
                  <Button small primary title='-' onClick={() => { }} />
                </div>
              </h2>
            </div>
          </SectionWrapper>
        </MainWrapper>
        <SecondaryWrapper>
          <SectionWrapper style={{ height: 200 }}>
            <div className='head'>
              <h4>
                Joined Pool
                <OpenAssistantIcon page='stake' title='Staking Status' />
              </h4>
              <PoolAccount address='133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3' />
              <h2>
                <div>
                  <Button
                    small
                    inline
                    primary
                    title='Leave'
                    onClick={() => { }}
                  />
                </div>
              </h2>
            </div>
          </SectionWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <h2>Active Pools</h2>
          <h4>In progress.</h4>
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Pools;