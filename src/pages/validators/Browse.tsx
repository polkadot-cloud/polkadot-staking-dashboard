import { PageProps } from '../types';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <h1>{title}</h1>
    </>
  );
}

export default Browse;