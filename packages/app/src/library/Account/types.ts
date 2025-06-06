// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePool, MaybeAddress } from 'types'

export interface AccountProps {
  value: MaybeAddress
  readOnly?: boolean
  onClick?: () => void
  className?: string
}

export interface PoolAccountProps {
  pool: ActivePool
  label: string
  syncing: boolean
}
