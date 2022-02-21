import { HeadingWrapper } from './Wrappers';

export const Heading = (props: any) => {

  const { title } = props;

  return (
    <HeadingWrapper>
      <h4>{title}</h4>
    </HeadingWrapper>
  )
}

export default Heading;