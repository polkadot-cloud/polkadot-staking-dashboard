// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
} from '@apollo/client'

export interface TokenPrice {
  price: number
  change: number
}

export type TokenPriceResult = {
  tokenPrice: TokenPrice
} | null

interface Query {
  loading: boolean
  error: ApolloError | undefined
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<unknown>>
}

export type UseTokenPriceResult = Query & {
  data: TokenPriceResult
}

export type AllRewardsResult = Query & {
  data: {
    allRewards: NominatorReward[]
  }
}

export interface NominatorReward {
  era: number
  reward: string
  claimed: boolean
  timestamp: number
  validator: string
  type: string
}

export type UnclaimedRewardsResult = Query & {
  data: {
    unclaimedRewards: UnclaimedRewards
  }
}

export type ValidatorRewardsResult = Query & {
  data: {
    validatorRewards: ValidatorReward[]
  }
}

export interface ValidatorReward {
  era: number
  reward: string
  start: number
}

export type PoolRewardResults = Query & {
  data: {
    poolRewards: PoolReward[]
  }
}

export type FastUnstakeStatus =
  | 'UNSUPPORTED_CHAIN'
  | 'NOT_PROCESSED'
  | 'NOT_EXPOSED'
  | 'EXPOSED'

export interface FastUnstakeResult {
  status: FastUnstakeStatus
  lastExposed?: number
}

export type CanFastUnstakeResult = Query & {
  data: {
    canFastUnstake: FastUnstakeResult
  }
}

export type ValidatorEraPointsResult = Query & {
  data: {
    validatorEraPoints: ValidatorEraPoints[]
  }
}

export interface UnclaimedRewards {
  total: string
  entries: EraUnclaimedReward[]
}
export interface EraUnclaimedReward {
  era: number
  reward: string
  validators: ValidatorUnclaimedReward[]
}

export interface ValidatorUnclaimedReward {
  validator: string
  reward: string
  page: number | null
}

export interface ValidatorEraPoints {
  era: number
  points: string
  start: number
}

export interface PoolReward {
  reward: string
  timestamp: number
  who: string
  poolId: number
}

export type PoolEraPointsResult = Query & {
  data: {
    poolEraPoints: PoolEraPoints[]
  }
}

export interface PoolEraPoints {
  era: number
  points: string
  start: number
}

export type PoolCandidatesResult = Query & {
  data: {
    poolCandidates: number[]
  }
}

export type PayoutsAndClaims = (NominatorReward | PoolReward)[]

export type RewardResult = NominatorReward | PoolReward
export type RewardResults = RewardResult[]
