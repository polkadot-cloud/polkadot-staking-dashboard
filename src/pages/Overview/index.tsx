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
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { SubscanButton } from '../../library/SubscanButton';
import { PageTitle } from '../../library/PageTitle';
import { planckToDot } from '../../Utils';
import moment from 'moment';
import { GRAPH_HEIGHT } from '../../constants';

export const Overview = (props: PageProps) => {

  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { staking }: any = useStaking();
  const { payouts }: any = useSubscan();

  // stats
  const items = [
    {
      label: "Total Nominators",
      value: staking.totalNominators,
      unit: "",
      format: "number",
    },
    {
      label: "Total Staked",
      value: staking.lastTotalStake,
      unit: network.unit,
      format: "number",
    },
    {
      label: "Last Reward Payout",
      value: staking.lastReward,
      unit: network.unit,
      format: "number",
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
              <h3>Recent Payouts</h3>
              <h1>
                {lastPayout === null ? 0 : lastPayout.amount} {network.unit}&nbsp;<span className='fiat'>{lastPayout === null ? `` : moment.unix(lastPayout['block_timestamp']).fromNow()}</span>
              </h1>
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