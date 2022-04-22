// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStaking } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import Payouts from './Payouts';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { SubscanButton } from '../../library/SubscanButton';
import { PageTitle } from '../../library/PageTitle';
import { planckToDot, defaultIfNaN } from '../../Utils';
import moment from 'moment';
import { GRAPH_HEIGHT } from '../../constants';

export const Overview = (props: PageProps) => {

  const { network, consts }: any = useApi();
  const { voterSnapshotPerBlock } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { totalIssuance } = metrics;
  const { activeAccount }: any = useConnect();
  const { staking, eraStakers }: any = useStaking();
  const { payouts }: any = useSubscan();

  const { totalNominators, maxNominatorsCount } = staking;
  const { activeNominators } = eraStakers;

  let supplyAsPercent = defaultIfNaN(((staking.lastTotalStake ?? 0) / (totalIssuance * 0.01)).toFixed(2), 0);
  let totalNominatorsAsPercent = defaultIfNaN(((totalNominators ?? 0) / (maxNominatorsCount * 0.01)).toFixed(2), 0);
  let activeNominatorsAsPercent = defaultIfNaN(((activeNominators ?? 0) / (voterSnapshotPerBlock * 0.01)).toFixed(2), 0);

  // stats
  const items = [
    {
      label: "Supply Staked",
      value: staking.lastTotalStake,
      value2: totalIssuance - staking.lastTotalStake,
      unit: network.unit,
      tooltip: `${supplyAsPercent}%`,
      format: "chart-pie",
      assistant: {
        page: 'overview',
        key: 'Supply Staked',
      },
    },

    {
      label: "Total Nominators",
      value: totalNominators,
      value2: maxNominatorsCount - totalNominators ?? 0,
      total: maxNominatorsCount,
      unit: "",
      tooltip: `${totalNominatorsAsPercent}%`,
      format: "chart-pie",
      assistant: {
        page: 'overview',
        key: 'Nominators',
      },
    },
    {
      label: "Active Nominators",
      value: activeNominators,
      value2: voterSnapshotPerBlock - activeNominators ?? 0,
      total: voterSnapshotPerBlock,
      unit: "",
      tooltip: `${activeNominatorsAsPercent}%`,
      format: "chart-pie",
      assistant: {
        page: 'overview',
        key: 'Active Nominators',
      },
    },
  ];

  let lastPayout: any = null;
  if (payouts.length > 0) {
    let _last = payouts[payouts.length - 1];
    lastPayout = {
      amount: planckToDot(_last['amount']),
      block_timestamp: _last['block_timestamp'] + "",
    };
  }

  return (
    <>
      <PageTitle title="What's Happening" />
      <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper style={{ flexBasis: '40%', maxWidth: '40%' }}>
          <BalanceGraph network={network} />
        </SecondaryWrapper>
        <MainWrapper paddingLeft>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <SubscanButton />
            <div className='head'>
              <h4>Recent Payouts</h4>
              <h2>
                {lastPayout === null ? 0 : lastPayout.amount} {network.unit}&nbsp;<span className='fiat'>{lastPayout === null ? `` : moment.unix(lastPayout['block_timestamp']).fromNow()}</span>
              </h2>
            </div>
            <Payouts account={activeAccount} payouts={payouts.slice(50, 60)} />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
}

export default Overview;