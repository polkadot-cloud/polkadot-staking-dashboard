// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Account, AccountCommon } from '@w3ux/types'

export type MaybeAddress = string | null

export type ActiveAccount = {
  address: string
  source: string
} | null

export type ActiveProxy = {
  address: string
  source: string
  proxyType: string
} | null

export type ImportedAccount = Account | ExternalAccount

export type ExternalAccount = AccountCommon & {
  network: string
  addedBy: AccountAddedBy
}

export type AccountAddedBy = 'system' | 'user'

export type Proxies = {
  proxies: {
    delegate: string
    proxyType: string
    delay: number
  }[]
  deposit: bigint
}
