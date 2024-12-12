// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NominatorReward } from 'plugin-staking-api/src/types'

export type PayoutType = 'payouts' | 'unclaimedPayouts' | 'poolClaims'

export type SubscanData = Partial<Record<PayoutType, SubscanResult>>

export interface SubscanPayoutData {
  payouts: SubscanPayout[]
  unclaimedPayouts: SubscanPayout[]
  poolClaims: SubscanPoolClaim[]
}

export type PayoutsAndClaims = (NominatorReward | SubscanPoolClaim)[]

export type SubscanRequestBody =
  | RewardSlashRequestBody
  | RewardRewardsRequestBody
  | RewardMembersRequestBody
  | PoolDetailsRequestBody

export type RewardSlashRequestBody = SubscanRequestPagination & {
  address: string
  is_stash: boolean
}

export type RewardRewardsRequestBody = SubscanRequestPagination & {
  address: string
  claimed_filter?: 'claimed' | 'unclaimed'
}

export type RewardMembersRequestBody = SubscanRequestPagination & {
  pool_id: number
}

export interface PoolDetailsRequestBody {
  pool_id: number
}

export interface SubscanRequestPagination {
  row: number
  page: number
}

export type SubscanResult =
  | NominatorReward[]
  | SubscanPoolClaim[]
  | SubscanPoolMember[]

export interface SubscanPoolClaimBase {
  account_display: {
    address: string
    display: string
    judgements: number[]
    identity: boolean
  }
  amount: string
  block_timestamp: number
  event_id: string
  event_index: string
  extrinsic_index: string
  module_id: string
  pool_id: number
}

export type SubscanPoolClaimRaw = SubscanPoolClaimBase & {
  amount: string
  block_timestamp: number
}

export type SubscanPoolClaim = SubscanPoolClaimBase & {
  reward: string
  timestamp: number
}

export interface SubscanPayout {
  era: number
  stash: string
  account: string
  validator_stash: string
  amount: string
  block_timestamp: number
  event_index: string
  module_id: string
  event_id: string
  extrinsic_index: string
  invalid_era: boolean
}

export interface SubscanPoolMember {
  pool_id: number
  bonded: string
  account_display: {
    address: string
    display: string
    judgements: [
      {
        index: number
        judgement: string
      },
    ]
    identity: boolean
  }
  claimable: string
}

export interface SubscanEraPoints {
  era: number
  reward_point: number
}
