// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import BigNumber from 'bignumber.js';
import type { NetworkId } from 'common-types';
import type { LocalValidatorExposure } from './types';

// Check if local exposure entry exists for an era.
export const hasLocalEraExposure = (
  network: NetworkId,
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
  network: NetworkId,
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
  network: NetworkId,
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
export const getLocalUnclaimedPayouts = (network: NetworkId, who: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_unclaimed_payouts`) || '{}'
  );
  return current?.[who] || {};
};

// Set local unclaimed payouts for an account.
export const setLocalUnclaimedPayouts = (
  network: NetworkId,
  era: string,
  who: string,
  unclaimdPayouts: Record<string, [number, string]>,
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
