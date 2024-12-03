// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface FavoritePoolsContextState {
  favorites: string[]
  addFavorite: (address: string) => void
  removeFavorite: (address: string) => void
}
