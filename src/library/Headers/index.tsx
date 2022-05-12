// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, HeadingWrapper, Item } from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { useExtrinsics } from '../../contexts/Extrinsics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Account } from '../Account';
import { Controller } from './Controller';
import { useUi } from '../../contexts/UI';
import { Spinner } from './Spinner';
import { pageFromUri } from '../../Utils';
import { useLocation } from 'react-router-dom';
import { useStaking } from '../../contexts/Staking';
import { useValidators } from '../../contexts/Validators/Validators';

export const Headers = () => {

  const { pathname } = useLocation();
  const assistant = useAssistant();
  const { connected, activeAccount, initialise }: any = useConnect();
  const { openModalWith } = useModal();
  const { isNominating } = useStaking();
  const { validators } = useValidators();
  const { pending } = useExtrinsics();
  const { setSideMenu, sideMenuOpen, isSyncing }: any = useUi();

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
          <span>
            <FontAwesomeIcon
              icon={faBars}
              style={{ cursor: 'pointer' }}
            />
          </span>
        </Item>
      </div>

      {(syncing || pending.length > 0) ? <Spinner /> : <></>}

      {/* connected, display stash and controller */}
      {connected === 1 &&
        <>
          <HeadingWrapper>
            <Account
              canClick={true}
              onClick={() => openModalWith('ConnectAccounts', {}, 'small')}
              value={activeAccount}
              label={isNominating() ? 'Stash' : undefined}
              format='name'
              filled
              wallet
            />
          </HeadingWrapper>
          <HeadingWrapper>
            <Controller />
          </HeadingWrapper>
        </>
      }
      {/* not connected, display connect accounts */}
      {connected === 0 &&
        <HeadingWrapper>
          <Item
            className='connect'
            onClick={() => {
              initialise();
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span>Connect Accounts</span>
          </Item>
        </HeadingWrapper>
      }
      {/* always display assistant */}
      <HeadingWrapper>
        <Item
          onClick={() => { assistant.toggle() }}
          whileHover={{ scale: 1.02 }}
        >
          {connected === 0 && <div className='label'>1</div>}
          <span>Assistant</span>
        </Item>
      </HeadingWrapper>
    </Wrapper>
  );
}

export default Headers;