// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PoolsConfigContextState {
  addFavorite: (a: string) => void;
  removeFavorite: (a: string) => void;
  favorites: string[];
}
