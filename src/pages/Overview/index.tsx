import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PayoutGraph from './PayoutGraph';
import BalanceGraph from './BalanceGraph';
import NumberEasing from 'che-react-number-easing';
import Announcements from './Announcements';
import { ACTIVE_ENDPOINT } from '../../constants';

export const Overview = (props: PageProps) => {

  const { staking } = useStakingMetrics();

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
      unit: ACTIVE_ENDPOINT.unit,
      format: "number",
    },
    {
      label: "Last Reward Payout",
      value: staking.lastReward,
      unit: ACTIVE_ENDPOINT.unit,
      format: "number",
    },
  ];

  const GRAPH_HEIGHT = 375;

  return (
    <>
      <h1>What's Happening</h1>
      <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }}>
            <h5>Your Accumulated Payouts</h5>
            <h1>
              <NumberEasing
                ease="quintInOut"
                precision={4}
                speed={250}
                trail={false}
                useLocaleString={false}
                value={17.18}
              />&nbsp;{ACTIVE_ENDPOINT.unit}
            </h1>
            <p><button>Past Month</button></p>
            <div className='graph'>
              <PayoutGraph />
            </div>
          </GraphWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <h5>Your {ACTIVE_ENDPOINT.unit} Balance</h5>
            <h1>$6,521.22</h1>
            <div className='graph'>
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