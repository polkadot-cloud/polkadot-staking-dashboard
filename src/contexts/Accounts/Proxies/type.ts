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

export type Proxies = Array<Proxy>;

export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<{
    delegate: string;
    proxyType: ProxyType;
  }>;
  reserved: BigNumber;
}

export interface Delegates {
  [key: string]: Array<DelegateItem>;
}

export interface DelegateItem {
  delegator: string;
  proxyType: ProxyType;
}

export type ProxiedAccounts = Array<ProxiedAccount>;

export interface ProxiedAccount {
  address: string;
  name: string;
  proxyType: ProxyType;
}

export interface ProxiesContextInterface {
  proxies: Proxies;
  delegates: Delegates;
  getDelegates: (a: MaybeAccount) => Proxy | undefined;
  getProxiedAccounts: (a: MaybeAccount) => ProxiedAccounts;
}
