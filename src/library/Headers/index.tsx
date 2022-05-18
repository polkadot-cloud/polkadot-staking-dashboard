// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocation } from 'react-router-dom';
import { Wrapper, HeadingWrapper, Item, SmallScreensOnly } from './Wrappers';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import { SideBar } from './SideBar';
import { useExtrinsics } from '../../contexts/Extrinsics';
import { useUi } from '../../contexts/UI';
import { Spinner } from './Spinner';
import { pageFromUri } from '../../Utils';
import { useValidators } from '../../contexts/Validators/Validators';
import { Toggle as SideBarToggle } from './SideBar/Toggle';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';

export const Headers = () => {
  const { pathname } = useLocation();
  const assistant = useAssistant();
  const { activeAccount }: any = useConnect();
  const { validators } = useValidators();
  const { pending } = useExtrinsics();
  const { isSyncing }: any = useUi();

  let syncing = isSyncing();

  // keep syncing if on validators page and still fetching
  if (pageFromUri(pathname) === 'validators') {
    if (!validators.length) {
      syncing = true;
    }
  }

  return (
    <>
      {/* side bar: closed by default, available on smaller screens */}
      <SideBar>
        <Connected />
      </SideBar>

      <Wrapper>
        {/* side menu toggle: shows on small screens */}
        <SideMenuToggle />

        {/* spinner to show app syncing */}
        {syncing || pending.length > 0 ? <Spinner /> : <></>}

        {/* side bar toggle: shows on small screens */}
        <SideBarToggle />

        {/* connected accounts */}
        <SmallScreensOnly>
          <Connected />
        </SmallScreensOnly>

        {/* not connected */}
        <Connect />

        {/* always display assistant */}
        <HeadingWrapper>
          <Item
            onClick={() => {
              assistant.toggle();
            }}
            whileHover={{ scale: 1.02 }}
          >
            {activeAccount === '' && <div className="label">1</div>}
            <span>Assistant</span>
          </Item>
        </HeadingWrapper>
      </Wrapper>
    </>
  );
};

export default Headers;
