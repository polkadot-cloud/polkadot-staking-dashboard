// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type BigNumber from 'bignumber.js'
import type { MaybeAddress } from './accounts'
import type { Identity, SuperIdentity } from './identity'
import type { Nominations } from './nominate'

export type BondedPool = ActiveBondedPool & {
  addresses: PoolAddresses
  id: number
  commission?: {
    current?: AnyJson | null
    max?: AnyJson | null
    changeRate: {
      maxIncrease: AnyJson
      minDelay: AnyJson
    } | null
    throttleFrom?: AnyJson | null
  }
}

export interface PoolAddresses {
  stash: string
  reward: string
}

export type MaybePool = number | null

export type PoolNominations = {
  submittedIn: string
  suppressed: boolean
  targets: string[]
} | null

export type NominationStatuses = Record<string, string>

export type PoolTab = 'All' | 'Active' | 'Locked' | 'Destroying'

export interface ActivePool {
  id: number
  addresses: PoolAddresses
  bondedPool: ActiveBondedPool
  rewardPool: RewardPool
  rewardAccountBalance: bigint
  pendingRewards: bigint
}

export interface ActiveBondedPool {
  points: string
  memberCounter: string
  roles: PoolRoles
  roleIdentities: {
    identities: Record<string, Identity>
    supers: Record<string, SuperIdentity>
  }
  state: PoolState
}

export interface RewardPool {
  lastRecordedRewardCounter: string
  lastRecordedTotalPayouts: string
  totalCommissionClaimed: string
  totalCommissionPending: string
  totalRewardsClaimed: string
}

export type PoolState = 'Open' | 'Blocked' | 'Destroying'

export interface PoolUnlocking {
  era: number
  value: BigNumber
}

export type PoolRole = 'depositor' | 'nominator' | 'root' | 'bouncer'

export interface PoolRoles {
  depositor?: MaybeAddress
  nominator?: MaybeAddress
  root?: MaybeAddress
  bouncer?: MaybeAddress
}

export interface PoolMember {
  poolId: number
  who: string
}

export interface DetailActivePool {
  address: string
  pool: ActivePoolItem
  activePool: ActivePool
  nominations: Nominations
}

export interface DetailRemovedPool {
  address: string
  poolId: number
}

export interface ActivePoolItem {
  id: string
  addresses: {
    stash: string
    reward: string
  }
}

export type AccountActivePools = Record<string, ActivePool | null>

export type AccountPoolNominations = Record<string, Nominations>

/*
 * Batch Key -> Pool Address -> Era -> Points.
 */
// Supported reward points batch keys.
export type PoolRewardPointsKey = string
// Pool reward batches, keyed by batch key.
export type PoolRewardPointsMap = Record<PoolRewardPointsKey, PoolRewardPoints>
export type PoolRewardPoints = Record<PoolAddress, PointsByEra>
export type PointsByEra = Record<EraKey, EraPoints>
export type PoolAddress = string
export type EraKey = number
export type EraPoints = string
