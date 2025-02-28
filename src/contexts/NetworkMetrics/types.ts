// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';

export interface NetworkMetricsContextInterface {
  activeEra: ActiveEra;
  metrics: NetworkMetrics;
  isPagedRewardsActive: (era: BigNumber) => boolean;
}

export interface ActiveEra {
  index: BigNumber;
  start: BigNumber;
}

export interface NetworkMetrics {
  totalIssuance: BigNumber;
  auctionCounter: BigNumber;
  earliestStoredSession: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
  minimumActiveStake: BigNumber;
}
