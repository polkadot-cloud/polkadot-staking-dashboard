// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useExtrinsics } from 'contexts/Extrinsics';
import { useUi } from 'contexts/UI';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';
import { Spinner } from './Spinner';
import { LargeScreensOnly, Wrapper } from './Wrappers';

export const Headers = () => {
  const { pending } = useExtrinsics();
  const { isSyncing } = useUi();

  return (
    <>
      <Wrapper>
        {/* side menu toggle: shows on small screens */}
        <SideMenuToggle />

        {/* spinner to show app syncing */}
        {isSyncing || pending.length > 0 ? <Spinner /> : null}

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
