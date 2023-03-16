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
  type: ProxyType;
}

export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<ProxyDelegate>;
  reserved: BigNumber;
}

export interface ProxyDelegate {
  delegate: string;
  type: ProxyType;
}

export interface ProxyAccount {
  address: string;
  name: string;
  type: ProxyType;
}

export interface ProxiesContextInterface {
  proxies: Array<Proxy>;
  delegates: Delegates;
  getProxies: (a: MaybeAccount) => Array<ProxyAccount>;
  getProxiedAccounts: (a: MaybeAccount) => Array<DelegateItem>;
}
