// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { FavoriteValidatorsContextInterface } from '../types';

export const defaultValidatorsData = {
  entries: [],
  notFullCommissionCount: 0,
  totalNonAllCommission: new BigNumber(0),
};

export const defaultFavoriteValidatorsContext: FavoriteValidatorsContextInterface =
  {
    addFavorite: (a) => {},
    removeFavorite: (a) => {},
    favorites: [],
    favoritesList: null,
  };
