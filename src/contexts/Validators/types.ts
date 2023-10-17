// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';

export interface ValidatorsContextInterface {
  fetchValidatorPrefs: (a: ValidatorAddresses) => Promise<Validator[] | null>;
  validators: Validator[];
  validatorIdentities: Record<string, Identity>;
  validatorSupers: Record<string, AnyJson>;
  avgCommission: number;
  sessionValidators: string[];
  sessionParaValidators: string[];
  nominated: Validator[] | null;
  poolNominated: Validator[] | null;
  validatorCommunity: any[];
  erasRewardPoints: ErasRewardPoints;
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
