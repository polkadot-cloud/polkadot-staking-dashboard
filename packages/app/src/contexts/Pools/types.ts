// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { PoolUnlocking } from 'types'

export type ClaimPermission =
  | 'Permissioned'
  | 'PermissionlessCompound'
  | 'PermissionlessWithdraw'
  | 'PermissionlessAll'

export interface PoolMembership {
  address: string
  poolId: number
  points: string
  balance: BigNumber
  lastRecordedRewardCounter: string
  unbondingEras: Record<number, string>
  claimPermission: ClaimPermission
  unlocking: PoolUnlocking[]
}
