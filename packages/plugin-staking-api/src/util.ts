// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CombinedPoolReward, NominatorReward, PoolReward } from './types'

export const isPoolReward = (
	p: PoolReward | NominatorReward,
): p is PoolReward => 'poolId' in p

export const isPoolShareReward = (
	p: PoolReward | NominatorReward,
): p is CombinedPoolReward =>
	isPoolReward(p) && p.source?.toLowerCase().includes('share') === true

export const isNominatorReward = (
	p: PoolReward | NominatorReward,
): p is NominatorReward => !isPoolReward(p)
