// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
  StakingMetrics,
  StakingTargets,
} from 'contexts/Staking/types';

export const defaultStakingMetrics: StakingMetrics = {
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

export const defaultEraStakers: EraStakers = {
  activeAccountOwnStake: [],
  activeValidators: 0,
  stakers: [],
  totalActiveNominators: 0,
};

export const defaultTargets: StakingTargets = {
  nominations: [],
};

const defaultLowestReward = {
  lowest: new BigNumber(0),
  oversubscribed: false,
};

export const defaultNominationStatus: NominationStatuses = {};

export const defaultStakingContext: StakingContextInterface = {
  fetchEraStakers: async (e) => new Promise((resolve) => resolve([])),
  getNominationsStatusFromTargets: (w, t) => defaultNominationStatus,
  setTargets: (t) => {},
  hasController: () => false,
  getControllerNotImported: (a) => null,
  addressDifferentToStash: (a) => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  getLowestRewardFromStaker: (address) => defaultLowestReward,
  staking: defaultStakingMetrics,
  eraStakers: defaultEraStakers,
  targets: defaultTargets,
  erasStakersSyncing: true,
};
