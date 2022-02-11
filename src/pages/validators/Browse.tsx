import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const items = [
    {
      label: "Active Validators",
      value: "297",
    },
    {
      label: "Current Epoch",
      value: "4 Hours",
    },
    {
      label: "Current Era",
      value: "1 Day",
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