// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export interface NetworkMetricsContextInterface {
  metrics: NetworkMetrics;
}

export interface NetworkMetrics {
  activeEra: {
    index: number;
    start: number;
  };
  totalIssuance: BN;
  auctionCounter: BN;
}
