// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { getEraRewardPoints, getValidatorEraPoints } from 'global-bus'
import { useMemo } from 'react'
import { useAverageRewardRate } from '../useAverageRewardRate'
import type { UseEnhancedRewardRate } from './types'

export const useEnhancedRewardRate = (): UseEnhancedRewardRate => {
	const { activeAddress } = useActiveAccounts()
	const { getNominations } = useBalances()
	const { getValidators } = useValidators()
	const { getAverageRewardRate } = useAverageRewardRate()

	// Get the nominated validators for the active account - memoized
	const nominatedValidators = useMemo(() => {
		const nominations = getNominations(activeAddress)
		const validators = getValidators()

		return nominations
			.map((address) => validators.find((v) => v.address === address))
			.filter(
				(validator): validator is NonNullable<typeof validator> =>
					validator !== undefined,
			)
	}, [activeAddress, getNominations, getValidators])

	// Calculate average commission rate of nominated validators - memoized
	const actualCommissionRate = useMemo(() => {
		if (nominatedValidators.length === 0) {
			return 0
		}

		const totalCommission = nominatedValidators.reduce((sum, validator) => {
			return sum + (validator?.prefs?.commission || 0)
		}, 0)

		return totalCommission / nominatedValidators.length
	}, [nominatedValidators])

	// Calculate era points performance factor for nominated validators - memoized
	const eraPointsMultiplier = useMemo(() => {
		const eraRewardPoints = getEraRewardPoints()

		if (
			nominatedValidators.length === 0 ||
			eraRewardPoints.individual.length === 0
		) {
			return 1 // Default multiplier if no data
		}

		// Calculate average era points of nominated validators
		const nominatedValidatorPoints = nominatedValidators.map((validator) =>
			getValidatorEraPoints(validator.address),
		)

		const avgNominatedPoints =
			nominatedValidatorPoints.reduce(
				(sum: number, points: number) => sum + points,
				0,
			) / nominatedValidatorPoints.length

		// Calculate network average era points
		const totalNetworkPoints = eraRewardPoints.individual.reduce(
			(sum: number, [, points]: [string, number]) => sum + points,
			0,
		)
		const avgNetworkPoints =
			totalNetworkPoints / eraRewardPoints.individual.length

		// Return performance multiplier (how well nominated validators perform vs network average)
		return avgNetworkPoints > 0 ? avgNominatedPoints / avgNetworkPoints : 1
	}, [nominatedValidators])

	// Getter functions for backwards compatibility
	const getActualCommissionRate = (): number => actualCommissionRate
	const getEraPointsMultiplier = (): number => eraPointsMultiplier
	const getNominatedValidators = () => nominatedValidators

	// Get enhanced reward rate that factors in validator performance and commission
	const getEnhancedRewardRate = (
		compounded: boolean = false,
		conservative: boolean = true,
	): number => {
		const baseRewardRate = getAverageRewardRate(compounded)

		// Apply era points performance factor
		let adjustedRate = baseRewardRate * eraPointsMultiplier

		// Apply conservative adjustment to match historical performance
		// Network theoretical rates often overestimate by 15-20% due to:
		// - Era timing variations, validator downtime, network effects, payout delays
		if (conservative) {
			const conservativeFactor = 0.85 // 15% reduction to match actual historical performance
			adjustedRate *= conservativeFactor
		}

		return adjustedRate
	}

	// Calculate more accurate annual reward with actual commission deduction
	const calculateAnnualRewardWithActualCommission = (
		stakeAmount: number,
		conservative: boolean = true,
	): {
		baseReward: number
		afterCommission: number
		commissionRate: number
		eraPointsMultiplier: number
		conservativeAdjustment: number
	} => {
		const baseRewardRate = getAverageRewardRate()

		// Apply era points and conservative factors
		let adjustedRate = baseRewardRate * eraPointsMultiplier
		const conservativeAdjustment = conservative ? 0.85 : 1.0

		if (conservative) {
			adjustedRate *= conservativeAdjustment
		}

		const baseReward = stakeAmount * (adjustedRate / 100)
		const afterCommission = baseReward * (1 - actualCommissionRate / 100)

		return {
			baseReward,
			afterCommission,
			commissionRate: actualCommissionRate,
			eraPointsMultiplier,
			conservativeAdjustment,
		}
	}

	return {
		getEnhancedRewardRate,
		getActualCommissionRate,
		getEraPointsMultiplier,
		getNominatedValidators,
		calculateAnnualRewardWithActualCommission,
	}
}
