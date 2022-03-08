// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Item } from '../Overview/Announcements/Wrappers';
import { motion } from 'framer-motion';
import { useApi } from '../../contexts/Api';

export const Nominations = (props: any) => {

  const { isReady }: any = useApi();
  const { nominators } = props;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25
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
    <Wrapper>
      <h3>Your Nominations</h3>

      {isReady() &&
        <motion.div variants={container} initial="hidden" animate="show">

          {nominators.length === 0 &&
            <Item variants={listItem}>
              <p>Finish staking setup to manage your nominated validators.</p>
            </Item>
          }

          {nominators.length > 0 &&
            <Item variants={listItem}>
              <p>You are currently nominating {nominators.length} validator{nominators.length === 1 ? '' : 's'}.</p>
            </Item>
          }
        </motion.div>
      }
    </Wrapper>
  );
}

export default Nominations;
