// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { LocalMeta } from 'contexts/FastUnstake/types';
import type { LocalExposureData, Validator } from 'contexts/Validators/types';
import type { AnyJson, NetworkName } from 'types';

// Get favorite validators from local storage.
export const getLocalFavorites = (network: NetworkName) => {
  const localFavourites = localStorage.getItem(`${network}_favorites`);
  return localFavourites !== null
    ? (JSON.parse(localFavourites) as string[])
    : [];
};

// Get validator exposures for an era.
export const getEraLocalExposures = (network: NetworkName, era: string) => {
  const data = localStorage.getItem('exposures');
  const current = data ? (JSON.parse(data) as LocalExposureData) : null;
  return current?.[network]?.era === era ? current[network] : null;
};

// Set validator exposure data to local storage.
export const setEraLocalExposures = (
  network: NetworkName,
  era: string,
  exposures: Validator[],
  avgCommission: number
) => {
  const data = localStorage.getItem('exposures') || '{}';
  localStorage.setItem(
    'exposures',
    JSON.stringify({
      ...JSON.parse(data),
      [network]: {
        era,
        exposures,
        avgCommission,
      },
    })
  );
};

// Validate local exposure metadata.
export const validateLocalExposure = (
  localMeta: AnyJson,
  endEra: BigNumber
): LocalMeta | null => {
  const localIsExposed = localMeta?.isExposed ?? null;
  let localChecked = localMeta?.checked ?? null;

  // check types saved.
  if (typeof localIsExposed !== 'boolean' || !Array.isArray(localChecked)) {
    return null;
  }
  // check checked only contains numbers.
  const checkedNumeric = localChecked.every((e) => typeof e === 'number');
  if (!checkedNumeric) {
    return null;
  }

  // remove any expired eras and sort highest first.
  localChecked = localChecked
    .filter((e: number) => endEra.isLessThan(e))
    .sort((a: number, b: number) => b - a);

  // if no remaining eras, invalid.
  if (!localChecked.length) {
    return null;
  }

  // check if highest -> lowest are decremented, no missing eras.
  let i = 0;
  let prev = 0;
  const noMissingEras = localChecked.every((e: number) => {
    i++;
    if (i === 1) {
      prev = e;
      return true;
    }
    const p = prev;
    prev = e;
    if (e === p - 1) return true;
    return false;
  });
  if (!noMissingEras) {
    return null;
  }
  return {
    isExposed: localIsExposed,
    checked: localChecked,
  };
};
