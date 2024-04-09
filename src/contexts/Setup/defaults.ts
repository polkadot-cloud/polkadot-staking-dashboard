// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type {
  NominatorProgress,
  PoolProgress,
  SetupContextInterface,
} from './types';

export const defaultNominatorProgress: NominatorProgress = {
  payee: {
    destination: null,
    account: null,
  },
  nominations: [],
  bond: '',
};

export const defaultPoolProgress: PoolProgress = {
  metadata: '',
  bond: '',
  nominations: [],
  roles: null,
};

export const defaultSetupContext: SetupContextInterface = {
  removeSetupProgress: (a, b) => {},
  getNominatorSetupPercent: (a) => 0,
  getPoolSetupPercent: (a) => 0,
  setActiveAccountSetup: (t, p) => {},
  setActiveAccountSetupSection: (t, s) => {},
  getNominatorSetup: (address) => ({
    section: 1,
    progress: defaultNominatorProgress,
  }),
  getPoolSetup: (address) => ({
    section: 1,
    progress: defaultPoolProgress,
  }),
};
