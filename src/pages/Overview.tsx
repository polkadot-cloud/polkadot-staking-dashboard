import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';

export const Overview = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

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
      <h1>{title}</h1>
      <StatBoxList title="What's Happening" items={items} />
    </>
  );
}

export default Overview;