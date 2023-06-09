// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';

export interface NetworkMetricsContextInterface {
  activeEra: ActiveEra;
  metrics: NetworkMetrics;
}

export interface NetworkMetrics {
  totalIssuance: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
  minimumActiveStake: BigNumber;
}

export interface ActiveEra {
  index: BigNumber;
  start: BigNumber;
  isPlaceholder?: boolean;
}
