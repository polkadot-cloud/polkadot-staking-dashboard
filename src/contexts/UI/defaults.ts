// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UIContextInterface } from './types';

export const defaultUIContext: UIContextInterface = {
  // eslint-disable-next-line
  setSideMenu: (v) => {},
  // eslint-disable-next-line
  setUserSideMenuMinimised: (v) => {},
  // eslint-disable-next-line
  toggleService: (k) => {},
  // eslint-disable-next-line
  getSetupProgress: (a) => {},
  // eslint-disable-next-line
  getSetupProgressPercent: (a) => 0,
  // eslint-disable-next-line
  setActiveAccountSetup: (p) => {},
  // eslint-disable-next-line
  setActiveAccountSetupSection: (s) => {},
  getServices: () => [],
  // eslint-disable-next-line
  setOnSetup: (v) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  onSetup: 0,
  isSyncing: false,
};
