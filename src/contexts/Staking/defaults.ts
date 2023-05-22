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
  stakers: [],
  nominators: undefined,
  totalActiveNominators: undefined,
  activeValidators: 0,
  activeAccountOwnStake: [],
};

export const defaultTargets: StakingTargets = {
  nominations: [],
};

export const defaultNominationStatus: NominationStatuses = {};

export const defaultStakingContext: StakingContextInterface = {
  getNominationsStatus: () => defaultNominationStatus,
  // eslint-disable-next-line
  getNominationsStatusFromTargets: (w, t) => defaultNominationStatus,
  // eslint-disable-next-line
  setTargets: (t) => {},
  hasController: () => false,
  // eslint-disable-next-line
  getControllerNotImported: (a) => null,
  // eslint-disable-next-line
  addressDifferentToStash: (a) => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  staking: defaultStakingMetrics,
  eraStakers: defaultEraStakers,
  targets: defaultTargets,
  erasStakersSyncing: true,
};
