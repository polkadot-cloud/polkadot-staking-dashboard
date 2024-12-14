// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NominatorReward } from 'plugin-staking-api/types'

export type PayoutType = 'poolClaims'

export type SubscanData = Partial<Record<PayoutType, SubscanResult>>

export interface SubscanPayoutData {
  poolClaims: SubscanPoolClaim[]
}

export type PayoutsAndClaims = (NominatorReward | SubscanPoolClaim)[]

export type SubscanRequestBody =
  | PoolRewardsRequestBody
  | PoolMembersRequestBody
  | PoolDetailsRequestBody

export type PoolRewardsRequestBody = SubscanRequestPagination & {
  address: string
  claimed_filter?: 'claimed' | 'unclaimed'
}

export type PoolMembersRequestBody = SubscanRequestPagination & {
  pool_id: number
}

export interface PoolDetailsRequestBody {
  pool_id: number
}

export interface SubscanRequestPagination {
  row: number
  page: number
}

export type SubscanResult = SubscanPoolClaim[] | SubscanPoolMember[]

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
