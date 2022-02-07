import { motion } from "framer-motion";
import Wrapper from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';

export const AssistantButton = () => {

  const assistant = useAssistant();

  return (
    <Wrapper>
      <div>
        <section>
          <p className='label'>subject</p>
        </section>
        <section>
          <motion.button
            onClick={() => { assistant.toggle() }}
            whileHover={{ scale: 1.02 }}
          >
            <div>5</div>
            <div>Assistant</div>
          </motion.button>
        </section>
      </div>
    </Wrapper>
  );
}

export default AssistantButton;