// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type SubscanRequestBody = EraStatRequestBody | PoolDataRequestBody

export type EraStatRequestBody = SubscanRequestPagination & {
  address: string
}

export type PoolDataRequestBody = SubscanRequestPagination & {
  pool_id: number
}

export interface SubscanRequestPagination {
  row: number
  page: number
}

export type SubscanResult = SubscanPoolMember[]

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
