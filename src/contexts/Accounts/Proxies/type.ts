// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { AnyApi, MaybeAccount } from 'types';

export type ProxyType = 'Staking' | 'Any';

export interface ProxyAccount {
  address: string;
  meta?: AnyApi;
  name: string;
  type: ProxyType;
}

export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<ProxyAccount>;
  reserved: BigNumber;
}

export interface ProxiesContextInterface {
  // getProxies: (address: MaybeAccount) => Array<Delegate> | null;
  // isProxied: (address: MaybeAccount) => boolean;
  proxies: Array<Proxy>;
}