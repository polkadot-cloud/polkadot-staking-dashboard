import { useState } from 'react';
import { Wrapper, HeadingWrapper, Item } from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMinus } from '@fortawesome/free-solid-svg-icons';

export const Headers = () => {

  const [showAccountMenu, toggleAccountMenu]: any = useState(false);

  const assistant = useAssistant();
  const connect = useConnect();
  const modal = useModal();

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
        <HeadingWrapper>
          <Item
            className='connect'
            onClick={() => connectWeb3()}
            whileHover={{ scale: 1.02 }}
          >
            Connect Accounts
          </Item>
        </HeadingWrapper>
      }

      {/* connected, display connected accounts */}
      {connect.status === 1 &&
        <HeadingWrapper>
          <Item
            whileHover={{ scale: 1.02 }}
            style={{ paddingLeft: 0 }}
            onClick={() => toggleAccountMenu(showAccountMenu ? false : true)}
          >
            <Identicon
              value={connect.activeAccount.address}
              size={26}
              theme="polkadot"
            />
            {demoAddressClipped} | {connect.activeAccount.name}
            <FontAwesomeIcon
              icon={!showAccountMenu ? faBars : faMinus}
              transform={!showAccountMenu ? "shrink-4" : "shrink-6"}
              style={{ cursor: 'pointer', marginLeft: '0.75rem' }}
            />
          </Item>
          {showAccountMenu &&
            <ul className='accounts'>
              <Item
                onClick={() => {
                  modal.setStatus(1);
                  toggleAccountMenu(false);
                }}
                whileHover={{ scale: 1.01 }}
              >
                Switch Accounts
              </Item>
              <Item
                onClick={() => {
                  connect.disconnect();
                  toggleAccountMenu(false);
                }}
                whileHover={{ scale: 1.01 }}
                style={{ color: '#ae2324' }}
              >
                Disconnect
              </Item>
            </ul>
          }
        </HeadingWrapper>
      }
      <HeadingWrapper>
        <Item
          onClick={() => { assistant.toggle() }}
          whileHover={{ scale: 1.02 }}
        >
          {connect.status === 0 && <div className='label'>1</div>}
          Assistant
        </Item>
      </HeadingWrapper>
    </Wrapper>
  );
}

export default Headers;