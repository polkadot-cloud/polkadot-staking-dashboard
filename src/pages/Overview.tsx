import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';

export const Overview = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <h1>{title}</h1>
      <StatBoxList title="What's Happening" />
    </>
  );
}

export default Overview;