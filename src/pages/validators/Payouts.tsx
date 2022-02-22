import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';

export const Payouts = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  // counterForValidators

  const items = [
    {
      label: "Last Era Paid",
      value: 297,
      unit: "",
    },
    {
      label: "Time Left this Era",
      value: 1,
      unit: "",
    },
    {
      label: "Outstanding Payouts",
      value: 0,
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

export default Payouts;