// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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

export type RewardTrendResult = Query & {
  data: {
    rewardTrend: RewardTrend
  }
}

export interface RewardTrend {
  reward: string
  previous: string
  change: {
    percent: string
    value: string
  }
}

export type ActiveValidatorRanksResult = Query & {
  data: {
    activeValidatorRanks: ActiveValidatorRank[]
  }
}

export interface ActiveValidatorRank {
  validator: string
  rank: number
}

export type ValidatorEraPointsResult = Query & {
  data: {
    validatorEraPoints: ValidatorEraPoints[]
  }
}

export type ValidatorEraPointsBatchResult = Query & {
  data: {
    validatorEraPointsBatch: ValidatorEraPointsBatch[]
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

export interface ValidatorEraPointsBatch {
  validator: string
  points: ValidatorEraPoints[]
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

export interface AverageRewardRateResult {
  rate: number
}

export type ValidatorRanksResult = {
  validator: string
  rank: number
}[]

export type ValidatorStatsResult = Query & {
  data: ValidatorStatsData
}

export interface ValidatorStatsData {
  averageRewardRate: AverageRewardRateResult
  activeValidatorRanks: ValidatorRanksResult
  averageValidatorCommission: number
}

export type RpcEndpointHealthResult = Query & {
  data: RpcEndpointChainHealth
}

export interface RpcEndpointChainHealth {
  chains: {
    chain: string
    endpoints: string[]
  }[]
}
