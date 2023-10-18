// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { PayeeConfig } from 'contexts/Setup/types';
import type { MaybeAddress } from 'types';

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

export interface ActiveAccountOwnStake {
  address: string;
  value: string;
}
export interface EraStakers {
  activeAccountOwnStake: ActiveAccountOwnStake[];
  activeValidators: number;
  stakers: Staker[];
  totalActiveNominators: number;
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
  lowestReward: string;
  oversubscribed: boolean;
};

export interface ActiveAccountStaker {
  address: string;
  value: string;
}

export interface ExposureOther {
  who: string;
  value: string;
}

interface LowestReward {
  lowest: BigNumber;
  oversubscribed: boolean;
}

export interface StakingContextInterface {
  fetchEraStakers: (era: string) => Promise<Exposure[]>;
  getNominationsStatusFromTargets: (w: MaybeAddress, t: any[]) => any;
  setTargets: (t: any) => any;
  hasController: () => boolean;
  getControllerNotImported: (a: MaybeAddress) => any;
  addressDifferentToStash: (a: MaybeAddress) => boolean;
  isBonding: () => boolean;
  isNominating: () => boolean;
  inSetup: () => any;
  getLowestRewardFromStaker: (a: MaybeAddress) => LowestReward;
  staking: StakingMetrics;
  eraStakers: EraStakers;
  targets: any;
  erasStakersSyncing: any;
}

export interface LocalExposuresData {
  era: string;
  exposures: LocalExposure[];
}

export interface LocalExposure {
  k: [string, string];
  v: {
    o: [string, string];
    w: string;
    t: string;
  };
}
