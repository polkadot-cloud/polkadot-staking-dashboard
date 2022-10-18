// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useExtrinsics } from 'contexts/Extrinsics';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { useLocation } from 'react-router-dom';
import { pageFromUri } from 'Utils';

import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';
import { Spinner } from './Spinner';
import { LargeScreensOnly, Wrapper } from './Wrappers';

export const Headers = () => {
  const { pathname } = useLocation();
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

        {/* connected accounts */}
        <LargeScreensOnly>
          <Connected />
        </LargeScreensOnly>

        {/* connect button */}
        <Connect />
      </Wrapper>
    </>
  );
};

export default Headers;
