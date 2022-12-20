// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  PoolCreateProgress,
  StakeSetupProgress,
  UIContextInterface,
} from './types';

export const defaultStakeSetup: StakeSetupProgress = {
  controller: null,
  payee: null,
  nominations: [],
  bond: '',
  section: 1,
};

export const defaultPoolSetup: PoolCreateProgress = {
  metadata: '',
  bond: '',
  nominations: [],
  roles: null,
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
  // eslint-disable-next-line
  setContainerRefs: (v) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  onNominatorSetup: 0,
  onPoolSetup: 0,
  isSyncing: false,
  networkSyncing: false,
  poolsSyncing: false,
  containerRefs: {},
};
