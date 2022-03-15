// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { List } from '../../library/List';
import { motion } from 'framer-motion';
import { Validator } from '../../library/Validator';

export const ValidatorList = (props: any) => {

  const { validators }: any = props;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const listItem = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1
    }
  };

  return (
    <List variants={container} initial="hidden" animate="show">
      {validators.map((addr: string, index: number) =>
        <motion.div className='item' key={`nomination_${index}`} variants={listItem}>
          <Validator address={addr} />
        </motion.div>
      )}
    </List>
  );
}

export default ValidatorList