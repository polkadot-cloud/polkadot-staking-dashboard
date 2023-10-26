// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { UIContextInterface } from './types';

export const defaultUIContext: UIContextInterface = {
  setSideMenu: (v) => {},
  setUserSideMenuMinimised: (v) => {},
  setContainerRefs: (v) => {},
  sideMenuOpen: false,
  userSideMenuMinimised: false,
  sideMenuMinimised: false,
  containerRefs: {},
  isSyncing: false,
  isNetworkSyncing: false,
  isPoolSyncing: false,
  isBraveBrowser: false,
};
