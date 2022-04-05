// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper, HeadingWrapper, Item } from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCogs, faBars } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown';
import { Account } from '../Account';
import { Controller } from './Controller';
import { useUi } from '../../contexts/UI';
import { Spinner } from './Spinner';
import { pageFromUri } from '../../Utils';
import { useLocation } from 'react-router-dom';
import { useStaking } from '../../contexts/Staking';

export const Headers = () => {

  const [showMenu, toggleMenu]: any = useState(false);

  const { pathname } = useLocation();
  const assistant = useAssistant();
  const connect = useConnect();
  const { openModalWith } = useModal();
  const { validators } = useStaking();
  const { setSideMenu, sideMenuOpen, isSyncing }: any = useUi();

  // subscribe to web3 accounts
  const connectWeb3 = async () => {
    connect.setAccounts();
  }

  let syncing = isSyncing();

  // keep syncing if on validators page and still fetching
  if (pageFromUri(pathname) === 'validators') {
    if (!validators.length) {
      syncing = true;
    }
  }

  return (
    <Wrapper>
      <div className='menu'>
        <Item
          style={{ width: '50px', flex: 0 }}
          onClick={() => { setSideMenu(sideMenuOpen ? 0 : 1); }}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{ cursor: 'pointer', color: '#666' }}
          />
        </Item>
      </div>

      {syncing && <Spinner />}

      {/* connected, display stash and controller */}
      {connect.status === 1 &&
        <>
          <HeadingWrapper>
            <Account
              canClick={false}
              address={connect.activeAccount}
              label='Stash'
              filled
            />
          </HeadingWrapper>
          <HeadingWrapper>
            <Controller />
          </HeadingWrapper>
        </>
      }
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
      {/* always display assistant */}
      <HeadingWrapper>
        <Item
          onClick={() => { assistant.toggle() }}
          whileHover={{ scale: 1.02 }}
        >
          {connect.status === 0 && <div className='label'>1</div>}
          Assistant
        </Item>
      </HeadingWrapper>

      {/* connected, display connected accounts */}
      {connect.status === 1 &&
        <HeadingWrapper>
          <Item
            whileHover={{ scale: 1.02 }}
            style={{ paddingLeft: 0, paddingRight: 0, width: '2.5rem' }}
            onClick={() => { toggleMenu(showMenu ? false : true); }}
          >
            <FontAwesomeIcon
              icon={!showMenu ? faCog : faCogs}
              transform={!showMenu ? undefined : `shrink-2`}
              style={{ cursor: 'pointer', color: '#444' }}
            />
          </Item>
          {showMenu &&
            <Dropdown
              items={
                <>
                  <Item
                    onClick={() => { openModalWith('ConnectAccounts'); toggleMenu(false); }}
                    whileHover={{ scale: 1.01 }}
                  >
                    Switch Account
                  </Item>
                  <Item
                    onClick={() => { openModalWith('Settings'); toggleMenu(false); }}
                    whileHover={{ scale: 1.01 }}
                  >
                    Services
                  </Item>
                  <Item
                    onClick={() => { connect.disconnect(); toggleMenu(false); }}
                    whileHover={{ scale: 1.01 }}
                    style={{ color: '#ae2324' }}
                  >
                    Disconnect
                  </Item>
                </>
              }
            />
          }
        </HeadingWrapper>
      }
    </Wrapper>
  );
}

export default Headers;