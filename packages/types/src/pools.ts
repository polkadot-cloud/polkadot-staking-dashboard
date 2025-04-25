// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { PalletNominationPoolsBondedPoolInner } from 'dedot/chaintypes'
import type { AccountId32 } from 'dedot/codecs'
import type { MaybeAddress } from './accounts'
import type { IdentityOf, SuperIdentity } from './identity'

export type ClaimPermission =
  | 'Permissioned'
  | 'PermissionlessCompound'
  | 'PermissionlessWithdraw'
  | 'PermissionlessAll'

export type BondedPool = PalletNominationPoolsBondedPoolInner & {
  addresses: PoolAddresses
  id: number
}

export interface ActivePool {
  id: number
  addresses: { stash: string; reward: string }
  bondedPool: {
    points: bigint
    memberCounter: number
    roles: {
      depositor: AccountId32
      nominator: AccountId32 | undefined
      root: AccountId32 | undefined
      bouncer: AccountId32 | undefined
    }
    roleIdentities: {
      identities: Record<string, IdentityOf>
      supers: Record<string, SuperIdentity>
    }
    state: 'Open' | 'Blocked' | 'Destroying'
  }
  rewardPool: {
    lastRecordedRewardCounter: bigint
    lastRecordedTotalPayouts: bigint
    totalCommissionClaimed: bigint
    totalCommissionPending: bigint
    totalRewardsClaimed: bigint
  }
  rewardAccountBalance: bigint
  nominators: {
    targets: AccountId32[]
    submittedIn: number
  }
}
export interface PoolAddresses {
  stash: string
  reward: string
}

export type MaybePool = number | null

export type PoolNominations =
  | {
      submittedIn: number
      suppressed: boolean
      targets: string[]
    }
  | undefined

export type NominationStatuses = Record<string, string>

export type PoolTab = 'All' | 'Active' | 'Locked' | 'Destroying'

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

export interface ActivePoolItem {
  id: string
  addresses: {
    stash: string
    reward: string
  }
}

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
