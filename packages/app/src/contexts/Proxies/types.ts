// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export type ProxyType =
  | 'Any'
  | 'NonTransfer'
  | 'Governance'
  | 'Staking'
  | 'IdentityJudgement'
  | 'CancelProxy'
  | 'Auction';

export type Proxies = Proxy[];

export interface Proxy {
  address: MaybeAddress;
  delegator: MaybeAddress;
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

export interface ProxyDelegateWithBalance {
  transferrableBalance: BigNumber;
  delegate: string;
  proxyType: ProxyType;
}

export interface ProxiesContextInterface {
  getDelegates: (a: MaybeAddress) => Proxy | undefined;
  getProxyDelegate: (x: MaybeAddress, y: MaybeAddress) => ProxyDelegate | null;
  getProxiedAccounts: (a: MaybeAddress) => ProxiedAccounts;
  handleDeclareDelegate: (delegator: string) => Promise<AnyJson[]>;
  formatProxiesToDelegates: () => Delegates;
}
