// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';

// Converts a given era to its corresponding timestamp
export const useEraToTimestamp = (era: number) => {
  const { activeEra } = useNetworkMetrics();
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;

  const eraPassed = activeEra.index.minus(era);
  const eraDurationBlocks = epochDuration.multipliedBy(sessionsPerEra);
  const eraDurationInSeconds = eraDurationBlocks
    .multipliedBy(expectedBlockTime)
    .multipliedBy(new BigNumber(0.001))
    .integerValue();
  const secondspassed = eraPassed.multipliedBy(eraDurationInSeconds);
  return activeEra.start.multipliedBy(0.001).minus(secondspassed);
};
