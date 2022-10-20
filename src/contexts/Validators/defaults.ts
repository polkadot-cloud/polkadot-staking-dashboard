// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidatorsContextInterface } from 'contexts/Validators/types';

export const sessionValidators = {
  list: [],
  unsub: null,
};

export const sessionParachainValidators = {
  list: [],
  unsub: null,
};

export const defaultValidatorsContext: ValidatorsContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchValidatorMetaBatch: (k, v, r) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeValidatorMetaBatch: (k) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchValidatorPrefs: async (v) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addFavorite: (a) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFavorite: (a) => {},
  validators: [],
  avgCommission: 0,
  meta: {},
  session: sessionValidators,
  sessionParachain: [],
  favorites: [],
  nominated: null,
  poolNominated: null,
  favoritesList: null,
  validatorCommunity: [],
};
