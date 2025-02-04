// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePool, Nominations, PoolRoles, PoolUnlocking } from 'types'

export interface ActivePoolContextState {
  inPool: () => boolean
  isBonding: () => boolean
  isNominator: () => boolean
  isOwner: () => boolean
  isMember: () => boolean
  isDepositor: () => boolean
  isBouncer: () => boolean
  getPoolUnlocking: () => PoolUnlocking[]
  getPoolRoles: () => PoolRoles
  activePool: ActivePool | null
  activePoolNominations: Nominations | null
}
