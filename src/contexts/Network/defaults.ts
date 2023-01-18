// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { NetworkMetrics, NetworkMetricsContextInterface } from './types';

export const metrics: NetworkMetrics = {
  activeEra: {
    index: 0,
    start: 0,
  },
  totalIssuance: new BigNumber(0),
  auctionCounter: new BigNumber(0),
  earliestStoredSession: new BigNumber(0),
  fastUnstakeErasToCheckPerBlock: 0,
};

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  metrics,
};
