// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocation } from 'react-router-dom';
import { useAssistant } from 'contexts/Assistant';
import { useConnect } from 'contexts/Connect';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { AssistantContextInterface } from 'types/assistant';
import { pageFromUri } from 'Utils';
import { ConnectContextInterface } from 'types/connect';
import { ValidatorsContextInterface } from 'types/validators';
import { SideBar } from './SideBar';
import { Spinner } from './Spinner';
import { Wrapper, HeadingWrapper, Item, LargeScreensOnly } from './Wrappers';
import { Toggle as SideBarToggle } from './SideBar/Toggle';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';

export const Headers = () => {
  const { pathname } = useLocation();
  const assistant = useAssistant() as AssistantContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { validators } = useValidators() as ValidatorsContextInterface;
  const { pending } = useExtrinsics();
  const { isSyncing }: any = useUi();

  let syncing = isSyncing;

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
        <LargeScreensOnly>
          <Connected />
        </LargeScreensOnly>

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
            {!activeAccount && <div className="label">1</div>}
            <span>Assistant</span>
          </Item>
        </HeadingWrapper>
      </Wrapper>
    </>
  );
};

export default Headers;
