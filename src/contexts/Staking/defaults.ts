// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
  StakingTargets,
} from 'contexts/Staking/types';

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
  getControllerNotImported: (a) => false,
  addressDifferentToStash: (a) => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  getLowestRewardFromStaker: (address) => defaultLowestReward,
  eraStakers: defaultEraStakers,
  targets: defaultTargets,
  erasStakersSyncing: true,
  getPagedErasStakers: (e) => new Promise((resolve) => resolve([])),
};
