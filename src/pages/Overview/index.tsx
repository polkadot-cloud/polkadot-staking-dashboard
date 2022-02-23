import { useEffect, useState } from 'react';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PriceGraph from './PriceGraph';
import BalanceGraph from './BalanceGraph';
import NumberEasing from 'che-react-number-easing';
import { useApi } from '../../contexts/Api';

export const Overview = (props: PageProps) => {

  const { staking } = useStakingMetrics();
  const { prices }: any = useApi();

  // stats
  const items = [
    {
      label: "Total Nominators",
      value: staking.totalNominators,
      unit: "",
    },
    {
      label: "Total Staked",
      value: staking.lastTotalStake,
      unit: "DOT",
    },
    {
      label: "Last Reward Payout",
      value: staking.lastReward,
      unit: "DOT",
    },
  ];

  return (
    <>
      <h1>What's Happening</h1>
      <StatBoxList items={items} />
      <PageRowWrapper>
        <MainWrapper>
          <GraphWrapper>
            <h5>DOT Price</h5>
            <h1>
              $<NumberEasing
                ease="quintInOut"
                precision={4}
                speed={250}
                trail={false}
                useLocaleString={false}
                value={prices.lastPrice}
              />
              <span className={`change${prices.change < 0 ? ` neg` : prices.change > 0 ? ` pos` : ``}`}>
                {prices.change < 0 ? `-` : prices.change > 0 ? `+` : ``}{prices.change}
              </span>
            </h1>
            <div className='graph'>
              <PriceGraph />
            </div>
          </GraphWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <GraphWrapper>
            <h5>Your DOT Balance</h5>
            <h1>$6,521.22</h1>
            <div className='graph'>
              <BalanceGraph />
            </div>
          </GraphWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Overview;