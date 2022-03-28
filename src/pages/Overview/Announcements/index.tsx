// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Item } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStakingMetrics } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';
import { humanNumber, planckToDot } from '../../../Utils';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';

export const Announcements = () => {

  const { isReady, network }: any = useApi();
  const { staking }: any = useStakingMetrics();
  const { minNominatorBond } = staking;

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

  if (!isReady() || staking.totalNominators === 0) {
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
      subtitle: `The maximum amount of nominators has almost been reached. The nominator cap is currently ${humanNumber(staking.maxNominatorsCount)}.`,
    });
  }

  // minimum nomination bond
  announcements.push({
    class: 'neutral',
    title: `The Minimum Nomination Bond is now at ${planckToDot(minNominatorBond)} ${network.unit}`,
    subtitle: `The minimum bonding amount of ${network.unit} to start nominating validators is now at ${planckToDot(minNominatorBond)} ${network.unit}.`,
  })



  if (!announcements.length) {
    return (<></>);
  }

  return (
    <SectionWrapper transparent>
      <Wrapper>
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={listItem}>
            <h3>Announcements</h3>
          </motion.div>
          {announcements.map((item, index) =>
            <Item key={`announcement_${index}`} variants={listItem}>
              <h3 className={item.class}>
                <FontAwesomeIcon
                  icon={faBack}
                  style={{ marginRight: '0.6rem' }}
                />
                {item.title}
              </h3>
              <p>{item.subtitle}</p>
            </Item>
          )}
        </motion.div>
      </Wrapper>
    </SectionWrapper>
  );
}

export default Announcements;
