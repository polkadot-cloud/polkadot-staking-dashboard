// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type AccountProxy = [
  {
    delay: number
    delegate: string
    proxy_type: {
      type: string
      value: undefined
    }
  }[],
  bigint,
]

export interface AccountProxiesEvent {
  address: string
  proxies: AccountProxy
}
