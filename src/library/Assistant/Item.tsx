import { motion } from 'framer-motion';
import { ItemWrapper as Wrapper } from './Wrapper';

export const Item = () => {

  return (
    <Wrapper>
      <motion.button
        className='item'
        whileHover={{ scale: 1.02 }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
      >
        <h4>Tutorials</h4>
        <h2>Title</h2>
      </motion.button>
    </Wrapper>
  );
}

export default Item;