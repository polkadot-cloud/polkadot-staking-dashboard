// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  PalletNominationPoolsClaimPermission,
  PalletStakingRewardDestination,
} from 'dedot/chaintypes'
import type { AccountId32 } from 'dedot/codecs'

export interface StakingLedger {
  ledger: Ledger | undefined
  payee: Payee | undefined
  nominators: Nominators | undefined
  poolMembership: PoolMembership | undefined
}

interface Ledger {
  stash: AccountId32
  total: bigint
  active: bigint
  unlocking: {
    value: bigint
    era: number
  }[]
}

interface Payee {
  destination: PalletStakingRewardDestination['type']
  account: AccountId32 | undefined
}

interface Nominators {
  targets: AccountId32[]
  submittedIn: number
}

export interface PoolMembership {
  address: string
  poolId: number
  points: bigint
  balance: bigint
  lastRecordedRewardCounter: bigint
  unbondingEras: [number, bigint][]
  claimPermission: PalletNominationPoolsClaimPermission
  pendingRewards: bigint
}
