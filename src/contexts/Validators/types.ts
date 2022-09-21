// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyMetaBatch } from 'types';

export interface ValidatorsContextInterface {
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => void;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (
    v: ValidatorAddresses
  ) => Promise<Array<Validator> | null>;
  addFavourite: (a: string) => void;
  removeFavourite: (a: string) => void;
  validators: Array<Validator>;
  meta: AnyMetaBatch;
  session: SessionValidators;
  sessionParachain: SessionParachainValidators;
  favourites: string[];
  nominated: Array<Validator> | null;
  poolNominated: Array<Validator> | null;
  favouritesList: Array<Validator> | null;
  validatorCommunity: Array<any>;
}

export type ValidatorAddresses = Array<{
  address: string;
}>;

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
