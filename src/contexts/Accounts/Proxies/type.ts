// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

export type ProxyType = 'Staking' | 'Any';

export interface Delegate {
  account: MaybeAccount;
  type: ProxyType;
}
export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<Delegate>;
  reserved: BigNumber;
}

export interface ProxiesContextInterface {
  // getProxies: (address: MaybeAccount) => Array<Delegate> | null;
  // isProxied: (address: MaybeAccount) => boolean;
  proxyMeta: Array<Proxy>;
}