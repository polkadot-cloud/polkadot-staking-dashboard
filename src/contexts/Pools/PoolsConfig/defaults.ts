// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { PoolsConfigContextState } from './types';
import type { PoolAddresses } from '../BondedPools/types';

export const defaultPoolsConfigContext: PoolsConfigContextState = {
  addFavorite: () => {},
  removeFavorite: () => {},
  createAccounts: () => poolAddresses,
  favorites: [],
};

export const poolAddresses: PoolAddresses = {
  stash: '',
  reward: '',
};
