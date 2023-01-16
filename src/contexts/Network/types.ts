// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export interface NetworkMetricsContextInterface {
  metrics: NetworkMetrics;
}

export interface NetworkMetrics {
  totalHousingFund: BN;
  totalUsers: number;
  decimals: number;
}
