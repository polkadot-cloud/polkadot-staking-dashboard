// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type { ActiveAccountOwnStake, ActiveAccountStaker } from 'types'

export interface StakingHookInterface {
	isBonding: boolean
	isNominating: boolean
	isNominator: boolean
}
