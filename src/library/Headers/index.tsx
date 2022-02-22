import { motion } from "framer-motion";
import Wrapper from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import Identicon from '@polkadot/react-identicon';
import { useModal } from '../../contexts/Modal';

export const Headers = () => {

  const assistant = useAssistant();
  const connect = useConnect();
  const { setStatus } = useModal();

  // demo purposes
  const demoAddress = '133YZZ6GvY8DGVjH2WExeGkahFQcw68N2MnVRieaURmqD3u3';
  const demoAddressClipped = '133YZZ…mqD3u3';

  return (
    <Wrapper>
      {/* not connected, display connect accounts */}
      {connect.status === 0 &&
        <section>
          <motion.button
            className='item connect'
            onClick={() => setStatus(1)}
            whileHover={{ scale: 1.02 }}
          >
            Connect Accounts
          </motion.button>
        </section>
      }

      {/* connected, display connected accounts */}
      {connect.status === 1 && <section>
        <motion.button
          className='item'
          whileHover={{ scale: 1.02 }}
          style={{ paddingLeft: 0 }}
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
          {connect.status === 0 && <div className='label'>1</div>}
          Assistant
        </motion.button>
      </section>
    </Wrapper>
  );
}

export default Headers;