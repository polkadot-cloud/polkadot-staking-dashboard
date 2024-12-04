// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolAddresses } from 'types'
import type { FavoritePoolsContextState } from './types'

export const defaultFavoritePoolsContext: FavoritePoolsContextState = {
  favorites: [],
  addFavorite: (address: string) => {},
  removeFavorite: (address: string) => {},
}

export const poolAddresses: PoolAddresses = {
  stash: '',
  reward: '',
}
