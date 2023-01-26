// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';

export interface NetworkMetricsContextInterface {
  activeEra: ActiveEra;
  metrics: NetworkMetrics;
}

export interface NetworkMetrics {
  totalIssuance: BigNumber;
  auctionCounter: BigNumber;
  earliestStoredSession: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
}

export interface ActiveEra {
  index: number;
  start: number;
}
