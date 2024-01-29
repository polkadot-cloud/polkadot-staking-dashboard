// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { NominationStatus } from 'library/ValidatorList/ValidatorItem/types';
import type { MaybeAddress } from 'types';

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

export type NominationStatuses = Record<string, NominationStatus>;

export interface StakingTargets {
  nominations: string[];
}

export interface Exposure {
  keys: string[];
  val: ExposureValue;
}

export interface ExposureValue {
  others: ExposureOther[];
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
  getNominationsStatusFromTargets: (
    w: MaybeAddress,
    t: string[]
  ) => Record<string, NominationStatus>;
  setTargets: (t: StakingTargets) => void;
  hasController: () => boolean;
  getControllerNotImported: (a: MaybeAddress) => boolean;
  addressDifferentToStash: (a: MaybeAddress) => boolean;
  isBonding: () => boolean;
  isNominating: () => boolean;
  inSetup: () => boolean;
  getLowestRewardFromStaker: (a: MaybeAddress) => LowestReward;
  eraStakers: EraStakers;
  targets: StakingTargets;
  erasStakersSyncing: boolean;
  getPagedErasStakers: (e: string) => Promise<Exposure[]>;
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
