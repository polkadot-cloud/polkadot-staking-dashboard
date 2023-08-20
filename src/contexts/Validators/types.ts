// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';

export interface ValidatorsContextInterface {
  addFavorite: (a: string) => void;
  removeFavorite: (a: string) => void;
  validators: Validator[];
  validatorIdentities: Record<string, Identity>;
  validatorSupers: Record<string, AnyJson>;
  avgCommission: number;
  sessionValidators: string[];
  sessionParaValidators: string[];
  favorites: string[];
  nominated: Validator[] | null;
  poolNominated: Validator[] | null;
  favoritesList: Validator[] | null;
  validatorCommunity: any[];
}

export interface Identity {
  deposit: string;
  info: AnyJson;
  judgements: AnyJson[];
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

export type LocalExposureData = Record<
  string,
  {
    avgCommission: number;
    era: string;
    exposures: Validator[];
  }
>;
