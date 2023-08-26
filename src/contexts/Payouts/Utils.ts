// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { AnyJson, NetworkName } from 'types';
import type { LocalValidatorExposure } from './types';

// Check if local exposure entry exists for an era.
export const hasLocalEraExposure = (
  network: NetworkName,
  era: string,
  who: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_exposures`) || '{}'
  );
  return !!current?.[who]?.[era];
};

// Get local exposure entry for an era.
export const getLocalEraExposure = (
  network: NetworkName,
  era: string,
  who: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_exposures`) || '{}'
  );
  return current?.[who]?.[era] || [];
};

// Set local exposure entry for an era.
export const setLocalEraExposure = (
  network: NetworkName,
  era: string,
  who: string,
  exposedValidators: Record<string, LocalValidatorExposure> | null,
  endEra: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_exposures`) || '{}'
  );

  const whoRemoveStaleEras = Object.fromEntries(
    Object.entries(current[who] || {}).filter(([k]: AnyJson) =>
      new BigNumber(k).isGreaterThanOrEqualTo(endEra)
    )
  );

  localStorage.setItem(
    `${network}_era_exposures`,
    JSON.stringify({
      ...current,
      [who]: {
        ...whoRemoveStaleEras,
        [era]: exposedValidators,
      },
    })
  );
};

// Get unclaimed payouts for an account.
export const getLocalUnclaimedPayouts = (network: NetworkName, who: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_unclaimed_payouts`) || '{}'
  );
  return current?.[who] || {};
};

// Set local unclaimed payouts for an account.
export const setLocalUnclaimedPayouts = (
  network: NetworkName,
  era: string,
  who: string,
  unclaimdPayouts: Record<string, string>,
  endEra: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_unclaimed_payouts`) || '{}'
  );

  const whoRemoveStaleEras = Object.fromEntries(
    Object.entries(current[who] || {}).filter(([k]: AnyJson) =>
      new BigNumber(k).isGreaterThanOrEqualTo(endEra)
    )
  );

  localStorage.setItem(
    `${network}_unclaimed_payouts`,
    JSON.stringify({
      ...current,
      [who]: {
        ...whoRemoveStaleEras,
        [era]: unclaimdPayouts,
      },
    })
  );
};
