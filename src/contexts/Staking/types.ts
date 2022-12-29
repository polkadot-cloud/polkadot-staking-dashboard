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
  maxValidatorsCount: BN;
  minNominatorBond: BN;
  payee: string | null;
  unsub: { (): void } | null;
}

export interface EraStakers {
  stakers: Array<any>;
  totalStaked: BN;
  nominators: Array<any> | undefined;
  totalActiveNominators: number;
  activeValidators: number;
  minActiveBond: number;
  minStakingActiveBond: number;
  ownStake: any;
}

export type NominationStatuses = { [key: string]: string };

export interface StakingTargets {
  nominations: string[];
}

export interface StakingContextInterface {
  getNominationsStatus: () => any;
  getNominationsStatusFromTargets: (w: MaybeAccount, t: [any]) => any;
  setTargets: (t: any) => any;
  hasController: () => boolean;
  getControllerNotImported: (a: MaybeAccount) => any;
  isBonding: () => boolean;
  isNominating: () => boolean;
  inSetup: () => any;
  staking: StakingMetrics;
  eraStakers: EraStakers;
  targets: any;
  erasStakersSyncing: any;
}
