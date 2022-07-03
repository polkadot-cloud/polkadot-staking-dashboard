// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';
import {
  StakingMetrics,
  EraStakers,
  StakingTargets,
  NominationStatuses,
  StakingContextInterface,
} from 'types/staking';

export const stakingMetrics: StakingMetrics = {
  totalNominators: new BN(0),
  totalValidators: new BN(0),
  lastReward: new BN(0),
  lastTotalStake: new BN(0),
  validatorCount: new BN(0),
  maxNominatorsCount: new BN(0),
  maxValidatorsCount: new BN(0),
  minNominatorBond: new BN(0),
  historyDepth: new BN(0),
  payee: null,
  unsub: null,
};

export const eraStakers: EraStakers = {
  stakers: [],
  activeNominators: 0,
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
  setTargets: (t: any) => {},
  hasController: () => false,
  // eslint-disable-next-line
  getControllerNotImported: (a: MaybeAccount) => null,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  staking: stakingMetrics,
  eraStakers,
  targets,
  erasStakersSyncing: true,
};
