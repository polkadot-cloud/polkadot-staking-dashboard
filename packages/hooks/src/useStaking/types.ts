// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StakingHookInterface {
	isBonding: boolean
	isNominating: boolean
	isNominator: boolean
}

export interface ActiveAccountOwnStake {
	address: string
	value: string
}

export interface ActiveAccountStaker {
	address: string
	value: string
}
