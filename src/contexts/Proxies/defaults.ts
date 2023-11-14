// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ProxiesContextInterface } from './types';

export const defaultProxiesContext: ProxiesContextInterface = {
  getDelegates: (a) => undefined,
  getProxyDelegate: (x, y) => null,
  getProxiedAccounts: (a) => [],
  handleDeclareDelegate: (a) => new Promise((resolve) => resolve([])),
  formatProxiesToDelegates: () => ({}),
  proxies: [],
};
