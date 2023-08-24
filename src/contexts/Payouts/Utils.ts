// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { AnyJson, NetworkName } from 'types';

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
  exposedValidators: Record<string, string> | null,
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
