import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PayoutGraph from './PayoutGraph';
import BalanceGraph from './BalanceGraph';
import NumberEasing from 'che-react-number-easing';
import Announcements from './Announcements';

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
            <h5>Your Payouts</h5>
            <h1>
              <NumberEasing
                ease="quintInOut"
                precision={4}
                speed={250}
                trail={false}
                useLocaleString={false}
                value={17.18}
              />&nbsp;DOT
            </h1>
            <p><button>Past Month</button></p>
            <div className='graph'>
              <PayoutGraph />
            </div>
          </GraphWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <GraphWrapper>
            <h5>Your DOT Balance</h5>
            <h1>$6,521.22</h1>
            <div className='graph' style={{ paddingRight: '1rem' }}>
              <BalanceGraph />
            </div>
          </GraphWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper>
        <Announcements />
      </PageRowWrapper>
    </>
  );
}

export default Overview;