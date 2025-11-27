// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import type { ServiceInterface } from 'types'

/**
 * Calculate the reward rate for a validator in a specific era, before commission
 *
 * @param erasPerDay - Number of eras per day for the network
 * @param validatorTotalStake - Total stake (own + nominated) for the validator in the era (in planck)
 * @param validatorReward - Total reward earned by the validator in the era (in planck)
 * @param decimals - Token decimals for the chain
 * @returns Object containing the annualized reward rate as a percentage
 */
export const calculateValidatorEraRewardRate = (
	erasPerDay: number,
	validatorTotalStake: bigint,
	validatorReward: bigint,
	decimals: number,
): number => {
	// Convert from planck to token units
	const validatorTotalStakeUnit = planckToUnit(validatorTotalStake, decimals)

	// Calculate daily reward by multiplying the single era reward by eras per day
	const dailyReward = validatorReward * BigInt(erasPerDay)
	const dailyRewardUnit = planckToUnit(dailyReward, decimals)

	// Annualize the daily reward
	const annualReward = Number(dailyRewardUnit) * 365

	// Calculate rate as a percentage of total stake
	const rate =
		Number(validatorTotalStakeUnit) === 0
			? 0
			: (annualReward / Number(validatorTotalStakeUnit)) * 100

	return rate
}

// Calculate the total reward earned by a validator in a specific era
export const calculteValidatorEraTotalReward = async (
	era: number,
	validator: string,
	serviceApi: ServiceInterface,
	eraRewardPoints:
		| { total: number; individual: [string, number][] }
		| undefined,
): Promise<bigint> => {
	const eraTotalPayout = await serviceApi.query.erasValidatorReward(era)
	if (!eraTotalPayout || eraTotalPayout === 0n) {
		return 0n
	}
	const totalRewardPoints = eraRewardPoints?.total || 0
	if (!eraRewardPoints || totalRewardPoints === 0) {
		return 0n
	}
	const validatorRewardPoints = eraRewardPoints.individual.find(([address]) => {
		return address === validator
	})?.[1]

	if (!validatorRewardPoints) {
		return 0n
	}

	const available: bigint =
		(eraTotalPayout * BigInt(validatorRewardPoints)) / BigInt(totalRewardPoints)

	return available
}
