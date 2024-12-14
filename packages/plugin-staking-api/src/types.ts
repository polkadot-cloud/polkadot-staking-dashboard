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
  reward: number
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
