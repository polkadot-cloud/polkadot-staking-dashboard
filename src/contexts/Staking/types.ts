// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { PayeeConfig } from 'contexts/Setup/types';
import type { MaybeAccount } from 'types';

export interface StakingMetrics {
  totalNominators: BigNumber;
  totalValidators: BigNumber;
  lastReward: BigNumber;
  lastTotalStake: BigNumber;
  validatorCount: BigNumber;
  maxValidatorsCount: BigNumber;
  minNominatorBond: BigNumber;
  payee: PayeeConfig;
  totalStaked: BigNumber;
}

export interface EraStakers {
  stakers: any[];
  nominators: any[] | undefined;
  totalActiveNominators: number;
  activeValidators: number;
  activeAccountOwnStake: any[];
}

export type NominationStatuses = Record<string, string>;

export interface StakingTargets {
  nominations: string[];
}

export interface Exposure {
  keys: string[];
  val: ExposureValue;
}

export interface ExposureValue {
  others: {
    value: string;
    who: string;
  }[];
  own: string;
  total: string;
}

export type Staker = ExposureValue & {
  address: string;
};

export interface ActiveAccountStaker {
  address: string;
  value: string;
}

export interface ExposureOther {
  who: string;
  value: string;
}

export interface StakingContextInterface {
  getNominationsStatus: () => any;
  getNominationsStatusFromTargets: (w: MaybeAccount, t: any[]) => any;
  setTargets: (t: any) => any;
  hasController: () => boolean;
  getControllerNotImported: (a: MaybeAccount) => any;
  addressDifferentToStash: (a: MaybeAccount) => boolean;
  isBonding: () => boolean;
  isNominating: () => boolean;
  inSetup: () => any;
  staking: StakingMetrics;
  eraStakers: EraStakers;
  targets: any;
  erasStakersSyncing: any;
}
