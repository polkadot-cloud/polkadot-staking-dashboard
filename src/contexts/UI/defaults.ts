// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UIContextInterface } from './types';

export const defaultUIContext: UIContextInterface = {
  // eslint-disable-next-line
  setSideMenu: (v) => {},
  // eslint-disable-next-line
  setUserSideMenuMinimised: (v) => {},
  // eslint-disable-next-line
  getSyncById: (id) => null,
  // eslint-disable-next-line
  setContainerRefs: (v) => {},
  // eslint-disable-next-line
  getSyncStart: (i) => 0,
  // eslint-disable-next-line
  setSyncStart: (i, s) => {},
  // eslint-disable-next-line
  getSyncSynced: (id: string) => true,
  // eslint-disable-next-line
  setSyncSynced: (i) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  containerRefs: {},
  isSyncing: false,
  networkSyncing: false,
  poolsSyncing: false,
};
