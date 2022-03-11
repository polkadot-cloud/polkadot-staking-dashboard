// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Item } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStakingMetrics } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';
import { humanNumber } from '../../../Utils';

export const Announcements = () => {

  const { isReady }: any = useApi();
  const { staking }: any = useStakingMetrics();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      }
    }
  };

  const listItem = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
    }
  };

  if (!isReady()) {
    return (<></>);
  }

  const nominatorCapReached = parseInt(staking.totalNominators) === parseInt(staking.maxNominatorsCount);
  const nominatorReachedPercentage = parseInt(staking.totalNominators) / (parseInt(staking.maxNominatorsCount) * 0.01);

  let announcements = [];

  // maximum nominators have been reached
  if (nominatorCapReached) {
    announcements.push({
      class: 'danger',
      title: 'Nominator Limit Has Been Reached',
      subtitle: 'The maximum allowed nominators have been reached on the network. Please wait for available slots if you wish to nominate.',
    });
  }

  // 90% plus nominators reached - warning
  if (nominatorReachedPercentage >= 90) {
    announcements.push({
      class: 'warning',
      title: `${nominatorReachedPercentage.toFixed(2)}% of Nominator Limit Reached`,
      subtitle: `The maximum amount of nominators has almost been reached. The nominator cap is currently ${humanNumber(staking.maxNominatorsCount)}`,
    });
  }

  if (!announcements.length) {
    return (<></>);
  }

  return (
    <Wrapper>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={listItem}>
          <h3>Announcements</h3>
        </motion.div>
        {announcements.map((item, index) =>
          <Item key={`announcement_${index}`} variants={listItem}>
            <h5 className={item.class}>
              <FontAwesomeIcon
                icon={faBack}
                style={{ marginRight: '0.6rem' }}
              />
              {item.title}
            </h5>
            <p>{item.subtitle}</p>
          </Item>
        )}
      </motion.div>
    </Wrapper>
  );
}

export default Announcements;
