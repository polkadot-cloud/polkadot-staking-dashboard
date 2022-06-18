// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { ActionProps } from '../types';
import { ItemWrapper as Wrapper } from '../Wrappers';

export const Action = (props: ActionProps) => {
  const { height, subtitle, label, title, onClick } = props;

  return (
    <Wrapper width="100%" height={height}>
      <motion.button
        className="item action"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: 'spring',
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
};

export default Action;
