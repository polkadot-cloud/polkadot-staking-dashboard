import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PriceGraph from './PriceGraph';
import BalanceGraph from './BalanceGraph';

export const Overview = (props: PageProps) => {

  const { staking } = useStakingMetrics();

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
            <h5>Historical Value USD</h5>
            <h1>$18.92</h1>
            <div className='graph'>
              <PriceGraph />
            </div>
          </GraphWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <GraphWrapper>
            <h5>Your Balance DOT</h5>
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