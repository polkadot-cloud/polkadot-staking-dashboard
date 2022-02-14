import { motion } from "framer-motion";
import Wrapper from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import Identicon from '@polkadot/react-identicon';


export const AssistantButton = () => {

  const assistant = useAssistant();
  const connect = useConnect();

  // demo purposes
  const demoAddress = '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3';
  const demoAddressClipped = '133YZZ…mqD3u3';

  return (
    <Wrapper>
      {connect.status === 1 && <section>
        <motion.button
          className='item'
          whileHover={{ scale: 1.02 }}
        >
          <Identicon
            value={demoAddress}
            size={26}
            theme="polkadot"
          />

          {demoAddressClipped}
        </motion.button>
      </section>
      }
      <section>
        <motion.button
          className='item'
          onClick={() => { assistant.toggle() }}
          whileHover={{ scale: 1.02 }}
        >
          <div className='label'>5</div>
          Assistant
        </motion.button>
      </section>
    </Wrapper>
  );
}

export default AssistantButton;