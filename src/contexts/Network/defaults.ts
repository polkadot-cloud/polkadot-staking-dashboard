// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { NetworkMetricsContextInterface } from './types';

export const defaultNetworkContext: NetworkMetricsContextInterface = {
  totalHousingFund: new BN(0),
  totalUsers: 0,
  decimals: 12,
  blockNumber: 0,
};
