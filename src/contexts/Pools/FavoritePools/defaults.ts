// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { FavoritePoolsContextState } from './types';
import type { PoolAddresses } from '../BondedPools/types';

export const defaultFavoritePoolsContext: FavoritePoolsContextState = {
  favorites: [],
  addFavorite: (address: string) => {},
  removeFavorite: (address: string) => {},
};

export const poolAddresses: PoolAddresses = {
  stash: '',
  reward: '',
};
