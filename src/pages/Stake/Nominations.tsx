// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from '../Overview/Announcements/Wrappers';
import { List } from '../../library/List';
import { motion } from 'framer-motion';
import { useApi } from '../../contexts/Api';
import { Validator } from '../../library/Validator';

export const Nominations = (props: any) => {

  const { isReady }: any = useApi();
  const { nominations } = props;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
        <>
          {nominations.length === 0 &&
            <List variants={container} initial="hidden" animate="show">
              <motion.div className='item' variants={listItem}>
                <h4>Finish staking setup to manage your nominated validators.</h4>
              </motion.div>
            </List>
          }

          {nominations.length > 0 &&
            <List variants={container} initial="hidden" animate="show">
              {nominations.map((addr: string, index: number) =>
                <motion.div className='item' key={`nomination_${index}`} variants={listItem}>
                  <Validator address={addr} />
                </motion.div>
              )}
            </List>
          }
        </>
      }
    </Wrapper>
  );
}

export default Nominations;
