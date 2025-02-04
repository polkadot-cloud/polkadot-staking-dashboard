// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisplayFor } from '@w3ux/types'
import type {
  Identity,
  PoolAddresses,
  PoolRoles,
  PoolState,
  SuperIdentity,
} from 'types'

export interface PoolProps {
  pool: Pool
}

export interface Pool {
  points: string
  memberCounter: string
  addresses: PoolAddresses
  id: number
  state: PoolState
  roles: PoolRoles
  roleIdentities: {
    identities: Record<string, Identity>
    supers: Record<string, SuperIdentity>
  }
}

export interface RewardProps {
  address: string
  displayFor?: DisplayFor
}

export interface RewardsGraphProps {
  points: number[]
  syncing: boolean
}
