// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkName } from 'types';

// Get favorite validators from local storage.
export const getLocalFavorites = (network: NetworkName) => {
  const localFavourites = localStorage.getItem(`${network}_favorites`);
  return localFavourites !== null
    ? (JSON.parse(localFavourites) as string[])
    : [];
};
