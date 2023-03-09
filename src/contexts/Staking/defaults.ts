// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
  StakingMetrics,
  StakingTargets,
} from 'contexts/Staking/types';

export const stakingMetrics: StakingMetrics = {
  totalNominators: new BigNumber(0),
  totalValidators: new BigNumber(0),
  lastReward: new BigNumber(0),
  lastTotalStake: new BigNumber(0),
  validatorCount: new BigNumber(0),
  maxValidatorsCount: new BigNumber(0),
  minNominatorBond: new BigNumber(0),
  payee: {
    destination: null,
    account: null,
  },
  totalStaked: new BigNumber(0),
};

export const eraStakers: EraStakers = {
  stakers: [],
  nominators: undefined,
  totalActiveNominators: 0,
  activeValidators: 0,
  activeAccountOwnStake: [],
};

export const targets: StakingTargets = {
  nominations: [],
};

export const nominationStatus: NominationStatuses = {};

export const defaultStakingContext: StakingContextInterface = {
  getNominationsStatus: () => nominationStatus,
  // eslint-disable-next-line
  getNominationsStatusFromTargets: (w, t) => nominationStatus,
  // eslint-disable-next-line
  setTargets: (t) => {},
  hasController: () => false,
  // eslint-disable-next-line
  getControllerNotImported: (a) => null,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  staking: stakingMetrics,
  eraStakers,
  targets,
  erasStakersSyncing: true,
};
