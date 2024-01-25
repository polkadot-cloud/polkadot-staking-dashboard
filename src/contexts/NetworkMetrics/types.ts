// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';

export interface NetworkMetricsContextInterface {
  activeEra: ActiveEra;
  isPagedRewardsActive: (era: BigNumber) => boolean;
}

export interface ActiveEra {
  index: BigNumber;
  start: BigNumber;
}
