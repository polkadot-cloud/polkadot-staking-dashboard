import { HeadingWrapper as Wrapper } from './Wrapper';

export const Heading = (props: any) => {

  const { title } = props;

  return (
    <Wrapper>
      {title}
    </Wrapper>
  )
}

export default Heading;