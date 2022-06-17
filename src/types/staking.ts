// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';

export interface StakingMetrics {
  totalNominators: BN;
  totalValidators: BN;
  lastReward: BN;
  lastTotalStake: BN;
  validatorCount: BN;
  maxNominatorsCount: BN;
  maxValidatorsCount: BN;
  minNominatorBond: BN;
  historyDepth: BN;
  payee: string | null;
  unsub: { (): void } | null;
}

export interface EraStakers {
  stakers: Array<any>;
  activeNominators: number;
  activeValidators: number;
  minActiveBond: number;
  minStakingActiveBond: number;
  ownStake: any;
}

export type NominationStatuses = { [key: string]: string };

export interface StakingTargets {
  nominations: Array<string>;
}

export interface StakingContextInterface {
  getNominationsStatus: () => any;
  setTargets: (t: any) => any;
  hasController: () => any;
  getControllerNotImported: (a: MaybeAccount) => any;
  isBonding: () => any;
  isNominating: () => any;
  inSetup: () => any;
  staking: StakingMetrics;
  eraStakers: EraStakers;
  targets: any;
  erasStakersSyncing: any;
}
