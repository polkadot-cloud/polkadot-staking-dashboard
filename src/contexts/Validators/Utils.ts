// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LocalExposureData, Validator } from 'contexts/Validators/types';
import type { NetworkName } from 'types';

// Get favorite validators from local storage.
export const getLocalFavorites = (network: NetworkName) => {
  const localFavourites = localStorage.getItem(`${network}_favorites`);
  return localFavourites !== null
    ? (JSON.parse(localFavourites) as string[])
    : [];
};

// Get validator exopsures for an era.
export const getEraLocalExposures = (network: NetworkName, era: string) => {
  const data = localStorage.getItem('exposures');
  const current = data ? (JSON.parse(data) as LocalExposureData) : null;

  if (current?.[network]?.era === era) {
    return current[network];
  }
  return null;
};

// Set validator exposure data to local storage.
export const setEraLocalExposures = (
  network: NetworkName,
  era: string,
  exposures: Validator[],
  avgCommission: number
) => {
  const current = localStorage.getItem('exposures') || '{}';
  localStorage.setItem(
    'exposures',
    JSON.stringify({
      ...JSON.parse(current),
      [network]: {
        era,
        exposures,
        avgCommission,
      },
    })
  );
};
