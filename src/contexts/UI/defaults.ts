// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UIContextInterface } from './types';

export const defaultStakeSetup = {
  controller: null,
  payee: null,
  nominations: [],
  bond: 0,
  section: 1,
};

export const defaultUIContext: UIContextInterface = {
  // eslint-disable-next-line
  setSideMenu: (v) => {},
  // eslint-disable-next-line
  setUserSideMenuMinimised: (v) => {},
  // eslint-disable-next-line
  toggleService: (k) => {},
  // eslint-disable-next-line
  getSetupProgress: (a, b) => {},
  // eslint-disable-next-line
  getStakeSetupProgressPercent: (a) => 0,
  // eslint-disable-next-line
  getPoolSetupProgressPercent: (a) => 0,
  // eslint-disable-next-line
  setActiveAccountSetup: (t, p) => {},
  // eslint-disable-next-line
  setActiveAccountSetupSection: (t, s) => {},
  getServices: () => [],
  // eslint-disable-next-line
  setOnNominatorSetup: (v) => {},
  // eslint-disable-next-line
  setOnPoolSetup: (v) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  onNominatorSetup: 0,
  onPoolSetup: 0,
  isSyncing: false,
};
