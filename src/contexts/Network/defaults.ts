// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { NetworkMetrics, NetworkMetricsContextInterface } from './types';

export const metrics: NetworkMetrics = {
  activeEra: {
    index: 0,
    start: 0,
  },
  totalIssuance: new BN(0),
  auctionCounter: new BN(0),
  earliestStoredSession: new BN(0),
};

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  metrics,
};
