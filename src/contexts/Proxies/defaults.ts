// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProxiesContextInterface } from './type';

export const defaultProxiesContext: ProxiesContextInterface = {
  // eslint-disable-next-line
  getDelegates: (a) => undefined,
  // eslint-disable-next-line
  getProxyDelegate: (x, y) => null,
  // eslint-disable-next-line
  getProxiedAccounts: (a) => [],
  // eslint-disable-next-line
  handleDeclareDelegate: (a) => new Promise((resolve) => resolve([])),
  proxies: [],
  delegates: {},
};
