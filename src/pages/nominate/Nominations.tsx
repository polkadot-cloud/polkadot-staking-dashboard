import { PageProps } from '../types';

export const Nominations = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <h1>{title}</h1>
    </>
  );
}

export default Nominations;