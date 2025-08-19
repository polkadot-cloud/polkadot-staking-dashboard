// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveStatusWithNominees } from 'plugin-staking-api/types'

export interface StakingContextInterface {
	isBonding: boolean
	isNominating: boolean
	isNominator: boolean
	activeStakerData: ActiveStatusWithNominees | null
}

export interface ActiveAccountOwnStake {
	address: string
	value: string
}

export interface ActiveAccountStaker {
	address: string
	value: string
}
