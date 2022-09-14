// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocation } from 'react-router-dom';
import { useAssistant } from 'contexts/Assistant';
import { useConnect } from 'contexts/Connect';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { pageFromUri } from 'Utils';
import { Spinner } from './Spinner';
import { Wrapper, HeadingWrapper, Item, LargeScreensOnly } from './Wrappers';
import { AccountsButton } from './AccountsButton';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';

export const Headers = () => {
  const { pathname } = useLocation();
  const assistant = useAssistant();
  const { activeAccount } = useConnect();
  const { validators } = useValidators();
  const { pending } = useExtrinsics();
  const { isSyncing } = useUi();

  let syncing = isSyncing;

  // keep syncing if on validators page and still fetching
  if (pageFromUri(pathname) === 'validators') {
    if (!validators.length) {
      syncing = true;
    }
  }

  return (
    <>
      <Wrapper>
        {/* side menu toggle: shows on small screens */}
        <SideMenuToggle />

        {/* spinner to show app syncing */}
        {syncing || pending.length > 0 ? <Spinner /> : <></>}

        {/* account button: shows on small screens */}
        <AccountsButton />

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
