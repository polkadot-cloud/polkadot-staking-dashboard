// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidatorsContextInterface } from 'contexts/Validators/types';

export const sessionValidators = {
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
  addFavourite: (a) => {},
  // eslint-disable-next-line
  removeFavourite: (a) => {},
  validators: [],
  meta: {},
  session: sessionValidators,
  favourites: [],
  nominated: null,
  poolNominated: null,
  favouritesList: null,
  validatorCommunity: [],
};
