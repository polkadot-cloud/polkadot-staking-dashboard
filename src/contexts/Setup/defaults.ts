// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
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
  // eslint-disable-next-line
  getSetupProgress: (a, b) => ({
    section: 1,
    progress: defaultNominatorProgress,
  }),
  // eslint-disable-next-line
  removeSetupProgress: (a, b) => {},
  // eslint-disable-next-line
  getNominatorSetupPercent: (a) => 0,
  // eslint-disable-next-line
  getPoolSetupPercent: (a) => 0,
  // eslint-disable-next-line
  setActiveAccountSetup: (t, p) => {},
  // eslint-disable-next-line
  setActiveAccountSetupSection: (t, s) => {},
  // eslint-disable-next-line
  setOnNominatorSetup: (v) => {},
  // eslint-disable-next-line
  setOnPoolSetup: (v) => {},
  onNominatorSetup: false,
  onPoolSetup: false,
};
