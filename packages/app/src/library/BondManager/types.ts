// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type BondFor = 'nominator' | 'pool'

export interface BondManagerProps {
	bondFor: BondFor
	isPreloading?: boolean
}
