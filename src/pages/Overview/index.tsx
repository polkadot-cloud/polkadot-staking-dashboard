import moment from 'moment';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PayoutGraph from './PayoutGraph';
import BalanceGraph from './BalanceGraph';
import NumberEasing from 'che-react-number-easing';
import { useApi } from '../../contexts/Api';
import * as faker from '@faker-js/faker';

export const Overview = (props: PageProps) => {

  const { staking } = useStakingMetrics();
  // const { prices }: any = useApi();

  /*
    <span className={`change${prices.change < 0 ? ` neg` : prices.change > 0 ? ` pos` : ``}`}>
    {prices.change < 0 ? `` : prices.change > 0 ? `+` : ``}{prices.change}
    </span>
  */

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
            <h5>Account Payouts</h5>
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
            <p><button>Last Month</button></p>
            <div className='graph'>
              <PayoutGraph />
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