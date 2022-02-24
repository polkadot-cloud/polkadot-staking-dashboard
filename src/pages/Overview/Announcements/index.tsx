import { Wrapper, Item } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStakingMetrics } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';

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

  const showAnnouncement = parseInt(staking.totalNominators) === parseInt(staking.maxNominatorsCount);
  if (!showAnnouncement) {
    return (<></>);
  }

  return (
    <Wrapper>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={listItem}>
          <h4>
            Announcements
          </h4>
        </motion.div>

        <Item variants={listItem}>
          <h5>
            <FontAwesomeIcon
              icon={faBack}
              style={{ marginRight: '0.6rem' }}
            />
            Nominator Limit Has Been Reached
          </h5>
          <p>The maximum allowed nominations have been reached on the network. Please wait for available slots if you wish to nominate.</p>
        </Item>
      </motion.div>
    </Wrapper>
  );
}

export default Announcements;
