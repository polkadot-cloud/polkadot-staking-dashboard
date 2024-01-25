// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { ActiveEra, NetworkMetricsContextInterface } from './types';
import type { NetworkMetrics } from 'contexts/Api/types';

export const activeEra: ActiveEra = {
  index: new BigNumber(0),
  start: new BigNumber(0),
};
export const metrics: NetworkMetrics = {
  totalIssuance: new BigNumber(0),
  auctionCounter: new BigNumber(0),
  earliestStoredSession: new BigNumber(0),
  fastUnstakeErasToCheckPerBlock: 0,
  minimumActiveStake: new BigNumber(0),
};

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  activeEra,
  isPagedRewardsActive: (e) => false,
};
