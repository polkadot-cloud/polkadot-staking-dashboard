import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';

export const Overview = (props: PageProps) => {

  const items = [
    {
      label: "Total Nominators",
      value: "22,000",
    },
    {
      label: "Total Staked",
      value: "615.9822",
    },
    {
      label: "Last Reward",
      value: "247,794",
    },
  ];

  return (
    <>
      <StatBoxList title="What's Happening" items={items} />
    </>
  );
}

export default Overview;