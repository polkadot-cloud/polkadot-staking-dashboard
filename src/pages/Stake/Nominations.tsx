// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Item } from '../Overview/Announcements/Wrappers';
import { motion } from 'framer-motion';
import { useStakingMetrics } from '../../contexts/Staking';
import { useApi } from '../../contexts/Api';

export const Nominations = () => {

  const { isReady }: any = useApi();
  const { staking }: any = useStakingMetrics();

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

  // const showAnnouncement = parseInt(staking.totalNominators) === parseInt(staking.maxNominatorsCount);
  // if (!showAnnouncement) {
  //   return (<></>);
  // }

  return (
    <Wrapper>
      <h3>
        Your Nominations
      </h3>
      {isReady() &&
        <motion.div variants={container} initial="hidden" animate="show">
          <Item variants={listItem}>
            <p>...</p>
          </Item>
        </motion.div>
      }
    </Wrapper>
  );
}

export default Nominations;
