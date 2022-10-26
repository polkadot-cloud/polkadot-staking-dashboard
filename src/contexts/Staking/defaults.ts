// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
  StakingMetrics,
  StakingTargets,
} from 'contexts/Staking/types';

export const stakingMetrics: StakingMetrics = {
  totalNominators: new BN(0),
  totalValidators: new BN(0),
  lastReward: new BN(0),
  lastTotalStake: new BN(0),
  validatorCount: new BN(0),
  maxNominatorsCount: new BN(0),
  maxValidatorsCount: new BN(0),
  minNominatorBond: new BN(0),
  payee: null,
  unsub: null,
};

export const eraStakers: EraStakers = {
  stakers: [],
  nominators: undefined,
  totalActiveNominators: 0,
  activeValidators: 0,
  minActiveBond: 0,
  minStakingActiveBond: 0,
  ownStake: 0,
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
