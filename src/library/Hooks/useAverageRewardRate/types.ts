// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';

export interface UseAverageRewardRate {
  getAverageRewardRate: (compounded: boolean) => AverageRewardRate;
}

export interface AverageRewardRate {
  inflationToStakers: BigNumber;
  avgRateBeforeCommission: BigNumber;
  avgRateAfterCommission: BigNumber;
}
