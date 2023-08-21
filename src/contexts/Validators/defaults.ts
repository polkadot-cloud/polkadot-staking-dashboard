// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { ValidatorsContextInterface } from 'contexts/Validators/types';

export const defaultExposureData = {
  exposures: [],
  notFullCommissionCount: 0,
  totalNonAllCommission: new BigNumber(0),
};

export const defaultValidatorsContext: ValidatorsContextInterface = {
  addFavorite: (a) => {},
  removeFavorite: (a) => {},
  validators: [],
  validatorIdentities: {},
  validatorSupers: {},
  avgCommission: 0,
  sessionValidators: [],
  sessionParaValidators: [],
  favorites: [],
  nominated: null,
  poolNominated: null,
  favoritesList: null,
  validatorCommunity: [],
};
