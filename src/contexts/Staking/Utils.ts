// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkName } from 'types';
import type { Exposure, LocalExposuresData } from './types';

// Get local `erasStakers` entries for an era.
export const getLocalEraExposures = (network: NetworkName, era: string) => {
  const data = localStorage.getItem('exposures');
  const current = data ? (JSON.parse(data) as LocalExposuresData) : null;
  return current?.[network]?.era === era ? current[network] : null;
};

// Set local stakers entries data for an era.
export const setLocalEraExposures = (
  network: NetworkName,
  era: string,
  exposures: Exposure[]
) => {
  const data = localStorage.getItem('exposures') || '{}';
  localStorage.setItem(
    'exposures',
    JSON.stringify({
      ...JSON.parse(data),
      [network]: {
        era,
        exposures,
      },
    })
  );
};
