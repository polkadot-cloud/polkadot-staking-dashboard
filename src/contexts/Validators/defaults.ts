// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ValidatorsContextInterface } from 'contexts/Validators/types';

export const defaultSessionValidators = {
  list: [],
  unsub: null,
};

export const defaultSessionParachainValidators = {
  list: [],
  unsub: null,
};

export const defaultValidatorsContext: ValidatorsContextInterface = {
  // eslint-disable-next-line
  fetchValidatorMetaBatch: (k, v, r) => {},
  // eslint-disable-next-line
  removeValidatorMetaBatch: (k) => {},
  // eslint-disable-next-line
  fetchValidatorPrefs: async (v) => null,
  // eslint-disable-next-line
  addFavorite: (a) => {},
  // eslint-disable-next-line
  removeFavorite: (a) => {},
  validators: [],
  avgCommission: 0,
  meta: {},
  session: defaultSessionValidators,
  sessionParachain: [],
  favorites: [],
  nominated: null,
  poolNominated: null,
  favoritesList: null,
  validatorCommunity: [],
};
