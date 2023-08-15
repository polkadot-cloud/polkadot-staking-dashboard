// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

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
  getSetupProgress: (a, b) => ({
    section: 1,
    progress: defaultNominatorProgress,
  }),
  removeSetupProgress: (a, b) => {},
  getNominatorSetupPercent: (a) => 0,
  getPoolSetupPercent: (a) => 0,
  setActiveAccountSetup: (t, p) => {},
  setActiveAccountSetupSection: (t, s) => {},
  setOnNominatorSetup: (v) => {},
  setOnPoolSetup: (v) => {},
  onNominatorSetup: false,
  onPoolSetup: false,
};
