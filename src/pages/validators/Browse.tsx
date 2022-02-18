import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useNetworkMetrics } from '../../contexts/Network';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { metrics } = useNetworkMetrics();

  // counterForValidators

  const items = [
    {
      label: "Active Validators",
      value: 297,
      unit: "",
    },
    {
      label: "Current Epoch",
      value: 1,
      unit: "",
    },
    {
      label: "Current Era",
      value: metrics.activeEra.index,
      unit: "",
    },
  ];

  return (
    <>
      <h1>{title}</h1>
      <StatBoxList title="This Session" items={items} />
    </>
  );
}

export default Browse;