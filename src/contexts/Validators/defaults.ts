// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidatorAddresses } from 'types/validators';

export const sessionValidators = {
  list: [],
  unsub: null,
};

export const defaultValidatorsContext = {
  // eslint-disable-next-line
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => {},
  // eslint-disable-next-line
  removeValidatorMetaBatch: (k: string) => {},
  // eslint-disable-next-line
  fetchValidatorPrefs: async (v: ValidatorAddresses) => null,
  // eslint-disable-next-line
  addFavourite: (a: string) => {},
  // eslint-disable-next-line
  removeFavourite: (a: string) => {},
  validators: [],
  meta: {},
  session: sessionValidators,
  favourites: [],
  nominated: null,
  poolNominated: null,
  favouritesList: null,
};
