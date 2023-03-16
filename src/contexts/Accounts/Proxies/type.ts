// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

export type ProxyType =
  | 'Any'
  | 'NonTransfer'
  | 'Governance'
  | 'Staking'
  | 'IdentityJudgement'
  | 'CancelProxy'
  | 'Auction';

export interface Delegates {
  [key: string]: Array<DelegateItem>;
}

export interface DelegateItem {
  delegator: string;
  proxyType: ProxyType;
}

export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<ProxyDelegate>;
  reserved: BigNumber;
}

export interface ProxyDelegate {
  delegate: string;
  proxyType: ProxyType;
}

export interface ProxyAccount {
  address: string;
  name: string;
  proxyType: ProxyType;
}

export interface ProxiesContextInterface {
  proxies: Array<Proxy>;
  delegates: Delegates;
  getProxiedAccounts: (a: MaybeAccount) => Array<ProxyAccount>;
}
