// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { AnyJson, MaybeAddress } from 'types'

export type Proxies = Proxy[]

export interface Proxy {
  address: MaybeAddress
  delegator: MaybeAddress
  delegates: ProxyDelegate[]
  reserved: BigNumber
}

export interface ProxyDelegate {
  delegate: string
  proxyType: string
}
export type Delegates = Record<string, DelegateItem[]>

export interface DelegateItem {
  delegator: string
  proxyType: string
}

export type ProxiedAccounts = ProxiedAccount[]

export interface ProxiedAccount {
  address: string
  name: string
  proxyType: string
}

export interface ProxyDelegateWithBalance {
  transferrableBalance: BigNumber
  delegate: string
  proxyType: string
}

export interface ProxiesContextInterface {
  getDelegates: (a: MaybeAddress) => Proxy | undefined
  getProxyDelegate: (x: MaybeAddress, y: MaybeAddress) => ProxyDelegate | null
  handleDeclareDelegate: (delegator: string) => Promise<AnyJson[]>
  formatProxiesToDelegates: () => Delegates
}
