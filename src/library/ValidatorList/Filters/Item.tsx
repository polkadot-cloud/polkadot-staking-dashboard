// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { ItemWrapper } from './Wrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export const Item = (props: any) => {

  const { icon, label, transform, onClick } = props;

  const [active, setActive] = useState(props.active);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.3,
      }}
      onClick={() => {
        setActive(!active);
        onClick();
      }}
    >
      <ItemWrapper active={active}>
        <section>
          {active &&
            <div className='active'>
              <FontAwesomeIcon icon={faCheck} transform="grow-0" />
            </div>
          }
          <div className='icon'>
            <FontAwesomeIcon icon={icon}
              color={active ? 'white' : '#aaa'}
              transform={transform}
            />
          </div>
        </section>
        <section>
          <p>{label}</p>
        </section>
      </ItemWrapper>
    </motion.button>
  )
}

export default Item;