// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { AnyApi, MaybeAccount } from 'types';

export type ProxyType =  'Any' | 'NonTransfer' | 'Governance' |  'Staking' | 'IdentityJudgement' | 'CancelProxy' | 'Auction';

export interface ProxyAccount {
  address: string;
  signer: MaybeAccount;
  meta?: AnyApi;
  name: string;
  type: ProxyType;
}

export interface Delegate {
  delegate: string;
  type: ProxyType;
}

export interface Proxy {
  delegator: MaybeAccount;
  delegates: Array<Delegate>;
  reserved: BigNumber;
}

export interface ProxiesContextInterface {
  proxies: Array<Proxy>;
  getProxyAccounts: (a: string) => Array<ProxyAccount>,
}