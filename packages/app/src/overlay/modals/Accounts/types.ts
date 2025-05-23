// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Proxy } from 'contexts/Proxies/types'
import type { MaybeAddress, PoolMembership } from 'types'

export interface AccountItemProps {
  address: MaybeAddress
  source: string
  label?: string[]
  asElement?: boolean
  delegator?: string
  noBorder?: boolean
  proxyType?: string
  transferrableBalance?: bigint
}

export interface DelegatesProps {
  delegator: string
  source: string
  delegates: Proxy | undefined
}

export interface AccountInPool extends PoolMembership {
  source: string
  delegates?: Proxy
}

export interface AccountNominating {
  address: MaybeAddress
  source: string
  stashImported: boolean
  delegates?: Proxy
}

export interface AccountNotStaking {
  address: string
  source: string
  delegates?: Proxy
}

export type AccountNominatingAndInPool = AccountNominating & AccountInPool
