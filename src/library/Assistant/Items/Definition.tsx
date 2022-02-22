import { motion } from 'framer-motion';
import { DefinitionWrapper as Wrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const Heading = (props: any) => {

  const { onClick } = props;

  return (
    <Wrapper width="100%" height="100px">
      <motion.button
        className='item'
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
        onClick={onClick}
      >
        <div>
          <h3>Definition</h3>
          <p>Short summary of definition.</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </motion.button>
    </Wrapper>
  )
}

export default Heading;