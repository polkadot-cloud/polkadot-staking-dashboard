// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Proxy } from 'contexts/Proxies/types'
import type { MaybeAddress, PoolMembership } from 'types'

export interface AccountButtonProps {
  address: MaybeAddress
  source: string
  label?: string[]
  asElement?: boolean
  delegator?: string
  noBorder?: boolean
  proxyType?: string
  transferableBalance?: bigint
}

export interface DelegatesProps {
  delegator: string
  source: string
  delegates: Proxy | undefined
}

export interface AccountInPoolProps extends PoolMembership {
  source: string
  delegates?: Proxy
}

export interface AccountItemProps {
  address: string
  source: string
  delegates?: Proxy
}

export type AccountNominatingInPoolProps = AccountItemProps & AccountInPoolProps
