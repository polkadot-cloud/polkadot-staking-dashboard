// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'types'

export interface UseEnhancedRewardRate {
	getEnhancedRewardRate: (
		compounded?: boolean,
		conservative?: boolean,
	) => number
	getActualCommissionRate: () => number
	getEraPointsMultiplier: () => number
	getNominatedValidators: () => NonNullable<Validator>[]
	calculateAnnualRewardWithActualCommission: (
		stakeAmount: number,
		conservative?: boolean,
	) => {
		baseReward: number
		afterCommission: number
		commissionRate: number
		eraPointsMultiplier: number
		conservativeAdjustment: number
	}
}
