// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type {
  ActiveEra,
  NetworkMetrics,
  NetworkMetricsContextInterface,
} from './types';

export const activeEra: ActiveEra = {
  index: new BigNumber(0),
  start: new BigNumber(0),
};
export const metrics: NetworkMetrics = {
  totalIssuance: new BigNumber(0),
  fastUnstakeErasToCheckPerBlock: 0,
  minimumActiveStake: new BigNumber(0),
};

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  activeEra,
  metrics,
};
