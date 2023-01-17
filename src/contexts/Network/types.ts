// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';

export interface NetworkMetricsContextInterface {
  metrics: NetworkMetrics;
}

export interface NetworkMetrics {
  activeEra: {
    index: number;
    start: number;
  };
  totalIssuance: BigNumber;
  auctionCounter: BigNumber;
  earliestStoredSession: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
}
