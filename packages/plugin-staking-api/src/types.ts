// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
	ApolloClient,
	ErrorLike,
	ObservableQuery,
	OperationVariables,
} from '@apollo/client'

import type { ApolloError } from '@apollo/client/v4-migration'

export interface TokenPrice {
	price: number
	change: number
}

export type TokenPriceResult = {
	tokenPrice: TokenPrice
} | null

// TODO: Remove once all queries are migrated to v4 Apollo Client
interface Query {
	loading: boolean
	error: ApolloError | undefined
	refetch: (
		variables?: Partial<OperationVariables> | undefined,
	) => Promise<ObservableQuery.Result<unknown>>
}

// NOTE: New Query type to use with v4 Apollo Client
interface QueryNew<TData> {
	loading: boolean
	error: ErrorLike | undefined
	refetch: (
		variables?: Partial<OperationVariables> | undefined,
	) => Promise<ApolloClient.QueryResult<TData>>
}

// NOTE: QueryReturn type to use with v4 Apollo Client
export type QueryReturn<T> = QueryNew<T> & {
	data: T
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

export type PoolRewardData = {
	poolRewards: PoolReward[]
}

export type EraTotalNominatorsData = {
	totalNominators: number
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

export type ActiveValidatorRanksData = {
	activeValidatorRanks: ActiveValidatorRank[]
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

export type ValidatorAvgRewardRateBatchResult = Query & {
	data: {
		validatorAvgRewardRateBatch: ValidatorAvgRewardRateBatch[]
	}
}

export interface ValidatorAvgRewardRateBatch {
	validator: string
	rate: number
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

export type PoolMembersResult = Query & {
	data: {
		poolMembers: PoolMembersData
	}
}

export interface PoolMembersData {
	poolId: number
	totalMembers: number
	members: PoolMember[]
}

export interface PoolMember {
	poolId: number
	address: string
	points: bigint
	unbondingEras: {
		era: number
		amount: string
	}[]
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
		endpoints: {
			label: string
			url: string
		}[]
	}[]
}

export interface RpcHealthLabels {
	chains: {
		chain: string
		endpoints: string[]
	}[]
}

export type SearchValidatorsResult = Query & {
	data: SearchValidatorsData
}
export interface SearchValidatorsData {
	total: number
	validators: {
		address: string
		commission: number
		blocked: boolean
		display: string
		superDisplay: string
	}[]
}

export type IsActiveStakerResult = Query & {
	data: {
		active: boolean
	}
}

export type GetActiveStakerWithNomineesData = {
	isActiveStaker: {
		active: boolean
	}
	getNomineesStatus: {
		statuses: {
			address: string
			status: string
		}[]
	}
}

export interface ActiveStatusWithNominees {
	active: boolean
	statuses: {
		address: string
		status: string
	}[]
}
