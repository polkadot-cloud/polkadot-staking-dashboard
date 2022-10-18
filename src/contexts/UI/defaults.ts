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

export const defaultPoolSetup = {
  metadata: '',
  bond: 0,
  nominations: [],
  roles: null,
  section: 1,
};

export const defaultUIContext: UIContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSideMenu: (v) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserSideMenuMinimised: (v) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleService: (k) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSetupProgress: (a, b) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getStakeSetupProgressPercent: (a) => 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPoolSetupProgressPercent: (a) => 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActiveAccountSetup: (t, p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActiveAccountSetupSection: (t, s) => {},
  getServices: () => [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOnNominatorSetup: (v) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOnPoolSetup: (v) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setContainerRefs: (v) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  onNominatorSetup: 0,
  onPoolSetup: 0,
  isSyncing: false,
  containerRefs: {},
};
