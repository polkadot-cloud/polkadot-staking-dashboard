// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PayoutGraph from './PayoutGraph';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';
import { planckToDot, fiatAmount, humanNumber } from '../../Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

export const Overview = (props: PageProps) => {

  const { network, prices }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { staking }: any = useStakingMetrics();
  const { getAccountBalance }: any = useBalances();

  const balance = getAccountBalance(activeAccount);

  // get user's total DOT balance
  let freeDot = planckToDot(balance.free);

  // convert balance to fiat value
  let freeBalance = fiatAmount(freeDot * prices.lastPrice);

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

  const GRAPH_HEIGHT = 400;

  return (
    <>
      <h1>What's Happening</h1>
      <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <h5>{network.unit} Balance</h5>
            <h1>{freeDot} DOT&nbsp;<span className='fiat'>${humanNumber(freeBalance)}</span>
            </h1>
            <div className='graph' style={{ maxWidth: 400, paddingRight: 10, }}>
              <BalanceGraph balances={balance} />
            </div>
          </GraphWrapper>
        </SecondaryWrapper>
        <MainWrapper paddingLeft>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <div className='label'>
              <FontAwesomeIcon
                icon={faProjectDiagram}
                transform="shrink-2"
                style={{ marginRight: '0.3rem' }}
              />
              Subscan
            </div>
            <h5>Recent Payouts</h5>
            <PayoutGraph account={activeAccount} />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
      <PageRowWrapper>
        <Announcements />
      </PageRowWrapper>
    </>
  );
}

export default Overview;