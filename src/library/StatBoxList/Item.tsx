import { StatBoxWrapper } from './Wrapper';

export const Item = (props: any) => {

  const { label } = props;

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

      </section>
      <section>
        <h3>{label}</h3>
      </section>
    </StatBoxWrapper>
  );
}

export default Item;