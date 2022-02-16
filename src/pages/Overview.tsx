import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';
import { useStakingMetrics } from '../contexts/Staking';

export const Overview = (props: PageProps) => {

  const { staking } = useStakingMetrics();

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
      <StatBoxList title="What's Happening" items={items} />
    </>
  );
}

export default Overview;