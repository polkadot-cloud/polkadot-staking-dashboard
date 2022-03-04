// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBoxWrapper } from './Wrapper';
import NumberEasing from 'che-react-number-easing';

export const Item = (props: any) => {

  const { label, value, unit, format } = props;
  let { currency } = props;

  if (currency === undefined) {
    currency = '';
  }

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
              value={value}
              useLocaleString={true}
              currency={currency}
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