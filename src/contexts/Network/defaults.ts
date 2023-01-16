// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { NetworkMetrics, NetworkMetricsContextInterface } from './types';

export const metrics: NetworkMetrics = {
  totalHousingFund: new BN(0),
  totalUsers: 0,
  decimals: 12,
};

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  metrics,
};
