// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { AnyJson, MaybeAccount } from 'types';

export type ProxyType =
  | 'Any'
  | 'NonTransfer'
  | 'Governance'
  | 'Staking'
  | 'IdentityJudgement'
  | 'CancelProxy';

export type Proxies = Proxy[];

export interface Proxy {
  address: MaybeAccount;
  delegator: MaybeAccount;
  delegates: ProxyDelegate[];
  reserved: BigNumber;
}

export interface ProxyDelegate {
  delegate: string;
  proxyType: ProxyType;
}
export type Delegates = Record<string, DelegateItem[]>;

export interface DelegateItem {
  delegator: string;
  proxyType: ProxyType;
}

export type ProxiedAccounts = ProxiedAccount[];

export interface ProxiedAccount {
  address: string;
  name: string;
  proxyType: ProxyType;
}

export interface ProxiesContextInterface {
  getDelegates: (a: MaybeAccount) => Proxy | undefined;
  getProxyDelegate: (x: MaybeAccount, y: MaybeAccount) => ProxyDelegate | null;
  getProxiedAccounts: (a: MaybeAccount) => ProxiedAccounts;
  handleDeclareDelegate: (delegator: string) => Promise<AnyJson[]>;
  proxies: Proxies;
  delegates: Delegates;
}
