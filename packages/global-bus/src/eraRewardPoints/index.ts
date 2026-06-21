// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { EraRewardPoints } from 'types'
import { defaultEraRewardPoints } from './default'
import { _eraRewardPoints } from './private'

export const eraRewardPoints$ = _eraRewardPoints.asObservable()

export const resetEraRewardPoints = () => {
	_eraRewardPoints.next(defaultEraRewardPoints)
}

export const getEraRewardPoints = () => _eraRewardPoints.getValue()

export const setEraRewardPoints = (value: EraRewardPoints) => {
	_eraRewardPoints.next(value)
}

export const getValidatorEraPoints = (address: string) => {
	const addressEntry = getEraRewardPoints().individual.find(
		(item) => item[0] === address,
	)
	return addressEntry?.[1] || 0
}

// Cached validator ranks, rebuilt once whenever era reward points change. The cache keeps reads
// O(1) and stops mutating the BehaviorSubject value.
let validatorRanks: { validator: string; rank: number }[] = []
let validatorRankMap = new Map<string, number>()

const rebuildValidatorRanks = ({ individual }: EraRewardPoints) => {
	// Copy before sorting so we never mutate the value held by the subject
	const sorted = [...individual].sort((a, b) => b[1] - a[1])

	validatorRanks = sorted.map(([validator], index) => ({
		validator,
		rank: index + 1,
	}))
	validatorRankMap = new Map(
		validatorRanks.map(({ validator, rank }) => [validator, rank]),
	)
}

// Seed the cache and keep it in sync with future emissions. The BehaviorSubject emits its current
// value synchronously on subscribe, so the cache is populated immediately.
_eraRewardPoints.subscribe(rebuildValidatorRanks)

export const getValidatorRanks = () => validatorRanks

export const getValidatorRank = (address: string) =>
	validatorRankMap.get(address) ?? null

export * from './default'
