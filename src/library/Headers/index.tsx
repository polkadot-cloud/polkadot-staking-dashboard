// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';
import { LargeScreensOnly, Wrapper } from './Wrappers';
import { Sync } from './Sync';

export const Headers = () => (
  <Wrapper>
    {/* Side menu toggle: shows on small screens. */}
    <SideMenuToggle />

    {/* Spinner to show app syncing. */}
    <Sync />

    {/* Connected accounts. */}
    <LargeScreensOnly>
      <Connected />
    </LargeScreensOnly>

    {/* Connect button. */}
    <Connect />
  </Wrapper>
);
