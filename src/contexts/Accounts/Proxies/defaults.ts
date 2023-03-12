// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type { ProxiesContextInterface } from './type';

export const proxy = {
  delegator: null,
  delegates: [],
  reserved: new BigNumber(0),
};

export const defaultProxiesContext: ProxiesContextInterface = {
  proxies: [],
  // eslint-disable-next-line
  getProxyAccounts: (a) => [],
};
