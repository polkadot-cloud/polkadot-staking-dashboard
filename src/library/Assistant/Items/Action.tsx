// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { ItemWrapper as Wrapper } from '../Wrappers';

export const Action = (props: any) => {

  let { height, subtitle, label, title, onClick } = props;

  return (
    <Wrapper
      width='100%'
      height={height}
      border={`3px solid #d33079`}
    >
      <motion.button
        className='item action'
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
        onClick={onClick}
      >
        <h4>{label}</h4>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </motion.button>
    </Wrapper>
  );
}

export default Action;