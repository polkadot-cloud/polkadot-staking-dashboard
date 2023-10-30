// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { LocalMeta } from 'contexts/FastUnstake/types';
import type {
  EraRewardPoints,
  LocalValidatorEntriesData,
  Validator,
} from 'contexts/Validators/types';
import type { AnyJson, NetworkName } from 'types';

// Get favorite validators from local storage.
export const getLocalFavorites = (network: NetworkName) => {
  const localFavourites = localStorage.getItem(`${network}_favorites`);
  return localFavourites !== null
    ? (JSON.parse(localFavourites) as string[])
    : [];
};

// Get local validator entries data for an era.
export const getLocalEraValidators = (network: NetworkName, era: string) => {
  const data = localStorage.getItem(`${network}_validators`);
  const current = data ? (JSON.parse(data) as LocalValidatorEntriesData) : null;
  const currentEra = current?.era;

  if (currentEra && currentEra !== era)
    localStorage.removeItem(`${network}_validators`);

  return currentEra === era ? current : null;
};

// Set local validator entries data for an era.
export const setLocalEraValidators = (
  network: NetworkName,
  era: string,
  entries: Validator[],
  avgCommission: number
) => {
  localStorage.setItem(
    `${network}_validators`,
    JSON.stringify({
      era,
      entries,
      avgCommission,
    })
  );
};

// Validate local exposure metadata, currently used for fast unstake only.
export const validateLocalExposure = (
  localMeta: AnyJson,
  endEra: BigNumber
): LocalMeta | null => {
  const localIsExposed = localMeta?.isExposed ?? null;
  let localChecked = localMeta?.checked ?? null;

  // check types saved.
  if (typeof localIsExposed !== 'boolean' || !Array.isArray(localChecked))
    return null;

  // check checked only contains numbers.
  const checkedNumeric = localChecked.every((e) => typeof e === 'number');
  if (!checkedNumeric) return null;

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

  if (!noMissingEras) return null;

  return {
    isExposed: localIsExposed,
    checked: localChecked,
  };
};

// Check if era reward points entry exists for an era.
export const hasLocalEraRewardPoints = (network: NetworkName, era: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  );
  return !!current?.[era];
};

// Get local era reward points entry for an era.
export const getLocalEraRewardPoints = (network: NetworkName, era: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  );
  return current?.[era] || {};
};

// Set local era reward points entry for an era.
export const setLocalEraRewardPoints = (
  network: NetworkName,
  era: string,
  eraRewardPoints: EraRewardPoints | null,
  endEra: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  );

  const removeStaleEras = Object.fromEntries(
    Object.entries(current || {}).filter(([k]: [string, unknown]) =>
      new BigNumber(k).isGreaterThanOrEqualTo(endEra)
    )
  );

  localStorage.setItem(
    `${network}_era_reward_points`,
    JSON.stringify({
      ...removeStaleEras,
      [era]: eraRewardPoints,
    })
  );
};
