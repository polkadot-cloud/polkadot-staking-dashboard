import { motion } from "framer-motion";
import Wrapper from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import Identicon from '@polkadot/react-identicon';

export const Headers = () => {

  const assistant = useAssistant();
  const connect = useConnect();

  const connectWeb3 = async () => {

    // subscribe to web3 accounts
    connect.setAccounts();
  }

  let demoAddress, demoAddressClipped;
  if (connect.status === 1) {
    // const { accounts } = connect;
    demoAddress = connect.accounts[0].address;
    demoAddressClipped = demoAddress.substring(0, 6) + '...' + demoAddress.substring(demoAddress.length - 6, demoAddress.length);
  }

  return (
    <Wrapper>
      {/* not connected, display connect accounts */}
      {connect.status === 0 &&
        <section>
          <motion.button
            className='item connect'
            onClick={() => connectWeb3()}
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
          onClick={() => connect.disconnect()}
        >
          <Identicon
            value={connect.activeAccount.address}
            size={26}
            theme="polkadot"
          />
          {demoAddressClipped} | {connect.activeAccount.name}
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