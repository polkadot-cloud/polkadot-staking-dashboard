// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { ItemWrapper } from './Wrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export const Item = (props: any) => {

  const { icon, label, transform, onClick } = props;

  const [active, setActive] = useState(props.active);

  const activeVariants = {
    hidden: {
      opacity: 0,
      top: '-14px',
    },
    visible: {
      opacity: 1,
      top: '-4px',
    },
  };

  const animateActive = active ? `visible` : `hidden`;

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
          <motion.div
            className='active'
            initial={false}
            animate={animateActive}
            transition={{
              duration: 0.3,
              type: "spring",
              bounce: 0.22
            }}
            variants={activeVariants}
          >
            <FontAwesomeIcon icon={faCheckCircle} color='rgba(211, 48, 121, 0.85)' transform="grow-4" />
          </motion.div>
          <div className='icon'>
            <FontAwesomeIcon icon={icon}
              color={active ? 'white' : '#ccc'}
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