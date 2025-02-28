// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ValidatorEntry } from '@polkadot-cloud/assets/types';
import type BigNumber from 'bignumber.js';
import type { AnyJson, BondFor, Sync } from 'types';

export interface ValidatorsContextInterface {
  fetchValidatorPrefs: (a: ValidatorAddresses) => Promise<Validator[] | null>;
  getValidatorPointsFromEras: (
    startEra: BigNumber,
    address: string
  ) => Record<string, BigNumber>;
  getNominated: (bondFor: BondFor) => Validator[] | null;
  injectValidatorListData: (entries: Validator[]) => ValidatorListEntry[];
  validators: Validator[];
  validatorIdentities: Record<string, Identity>;
  validatorSupers: Record<string, AnyJson>;
  avgCommission: number;
  sessionValidators: string[];
  sessionParaValidators: string[];
  nominated: Validator[] | null;
  poolNominated: Validator[] | null;
  validatorCommunity: ValidatorEntry[];
  erasRewardPoints: ErasRewardPoints;
  validatorsFetched: Sync;
  eraPointsBoundaries: EraPointsBoundaries;
  validatorEraPointsHistory: Record<string, ValidatorEraPointHistory>;
  erasRewardPointsFetched: Sync;
  averageEraValidatorReward: AverageEraValidatorReward;
}

export interface AverageEraValidatorReward {
  days: number;
  reward: BigNumber;
}

export interface FavoriteValidatorsContextInterface {
  addFavorite: (a: string) => void;
  removeFavorite: (a: string) => void;
  favorites: string[];
  favoritesList: Validator[] | null;
}

export interface Identity {
  deposit: string;
  info: AnyJson;
  judgements: AnyJson[];
}

export interface ValidatorSuper {
  identity: Identity;
  superOf: [string, { Raw: string }];
}

export type ValidatorAddresses = {
  address: string;
}[];

export interface Validator {
  address: string;
  prefs: ValidatorPrefs;
}

export interface ValidatorPrefs {
  commission: number;
  blocked: boolean;
}

export interface LocalValidatorEntriesData {
  avgCommission: number;
  era: string;
  entries: Validator[];
}

export type ErasRewardPoints = Record<string, EraRewardPoints>;

export interface EraRewardPoints {
  total: string;
  individual: Record<string, string>;
}

export type EraPointsBoundaries = {
  high: BigNumber;
  low: BigNumber;
} | null;

export type ValidatorListEntry = Validator & {
  validatorStatus: 'waiting' | 'active';
  totalStake: BigNumber;
};

export interface ValidatorEraPointHistory {
  eras: Record<string, BigNumber>;
  totalPoints: BigNumber;
  rank?: number;
  quartile?: number;
}
