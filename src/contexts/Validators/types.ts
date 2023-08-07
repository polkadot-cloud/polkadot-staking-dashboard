// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyMetaBatch } from 'types';

export interface ValidatorsContextInterface {
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => void;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (v: ValidatorAddresses) => Promise<Validator[] | null>;
  addFavorite: (a: string) => void;
  removeFavorite: (a: string) => void;
  validators: Validator[];
  avgCommission: number;
  meta: AnyMetaBatch;
  session: SessionValidators;
  sessionParachain: string[];
  favorites: string[];
  nominated: Validator[] | null;
  poolNominated: Validator[] | null;
  favoritesList: Validator[] | null;
  validatorCommunity: any[];
}

export type ValidatorAddresses = {
  address: string;
}[];

export interface SessionValidators {
  list: string[];
  unsub: { (): void } | null;
}

export interface SessionParachainValidators {
  list: string[];
  unsub: { (): void } | null;
}

export interface Validator {
  address: string;
  prefs: ValidatorPrefs;
}

export interface ValidatorPrefs {
  commission: number;
  blocked: boolean;
}
