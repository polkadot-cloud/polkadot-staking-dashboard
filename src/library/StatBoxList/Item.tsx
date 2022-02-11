import { StatBoxWrapper } from './Wrapper';

export const Item = (props: any) => {

  const { label, value } = props;

  return (
    <StatBoxWrapper
      whileHover={{ scale: 1.02 }}
      transition={{
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
      }}
    >
      <section>
        <h1>{value}</h1>
      </section>
      <section>
        <h4>{label}</h4>
      </section>
    </StatBoxWrapper>
  );
}

export default Item;