// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { StakingMetrics, EraStakers } from 'types/staking';

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

export const targets = {
  nominations: [],
};

export const nominationStatus = {};
