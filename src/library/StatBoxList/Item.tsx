import { StatBoxWrapper } from './Wrapper';
import NumberEasing from 'che-react-number-easing';

export const Item = (props: any) => {

  const { label, value, unit, format } = props;

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
        {format === 'number' &&
          <h1>
            <NumberEasing
              ease="quintInOut"
              precision={2}
              speed={250}
              trail={false}
              useLocaleString={true}
              value={value}
            />
            &nbsp;{unit}
          </h1>
        }
        {format === 'text' &&
          <h1>{value}</h1>
        }
      </section>
      <section>
        <h4>{label}</h4>
      </section>
    </StatBoxWrapper>
  );
}

export default Item;