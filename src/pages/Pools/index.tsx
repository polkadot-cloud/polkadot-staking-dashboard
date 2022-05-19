// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageProps } from '../types';
import { PageRowWrapper, Separator } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { PageTitle } from '../../library/PageTitle';
import { StatBoxList } from '../../library/StatBoxList';
import { defaultIfNaN, planckBnToUnit } from '../../Utils';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useApi } from '../../contexts/Api';
import { PoolAccount } from './PoolAccount';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { Button } from '../../library/Button';
import { PoolList } from '../../library/PoolList';
import { usePools } from '../../contexts/Pools';
import StatBoxListItem from '../../library/StatBoxList/Item';

export const Pools = (props: PageProps) => {
  const { page } = props;
  const { title } = page;
  const { network }: any = useApi();
  const { units } = network;
  const { stats, bondedPools } = usePools();
  const navigate = useNavigate();

  // back to overview if pools are not supported on network
  useEffect(() => {
    if (!network.features.pools) {
      navigate('/#/overview', { replace: true });
    }
  }, [network]);

  const totalPools = stats.counterForBondedPools
    .add(stats.counterForRewardPools)
    .toNumber();
  const activePoolsAsPercent = defaultIfNaN(
    (
      (stats.counterForRewardPools.toNumber() ?? 0) /
      (totalPools * 0.01)
    ).toFixed(2),
    0
  );

  // TODO: replace with real active pool if user has joined one.
  const activePool = bondedPools.find(
    (item: any) => item.id === stats.counterForRewardPools
  );

  const items: any = [
    {
      format: 'chart-pie',
      params: {
        label: 'Active Pools',
        stat: {
          value: stats.counterForRewardPools.toNumber(),
          total: totalPools,
          unit: '',
        },
        graph: {
          value1: stats.counterForRewardPools.toNumber(),
          value2: totalPools - stats.counterForRewardPools.toNumber(),
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
        value: planckBnToUnit(stats.minJoinBond, units),
        unit: network.unit,
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
        value: planckBnToUnit(stats.minCreateBond, units),
        unit: network.unit,
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
        <MainWrapper paddingLeft>
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
                last
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
            pools={bondedPools}
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
