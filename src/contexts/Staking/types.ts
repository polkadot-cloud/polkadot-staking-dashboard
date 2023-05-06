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
  stakers: Array<any>;
  nominators: Array<any> | undefined;
  totalActiveNominators: number;
  activeValidators: number;
  activeAccountOwnStake: Array<any>;
}

export type NominationStatuses = Record<string, string>;

export interface StakingTargets {
  nominations: string[];
}

export interface StakingContextInterface {
  getNominationsStatus: () => any;
  getNominationsStatusFromTargets: (w: MaybeAccount, t: Array<any>) => any;
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
