// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { AverageRewardRate } from './types';

export const defaultAverageRewardRate: AverageRewardRate = {
  inflationToStakers: new BigNumber(0),
  avgRateBeforeCommission: new BigNumber(0),
  avgRateAfterCommission: new BigNumber(0),
};
