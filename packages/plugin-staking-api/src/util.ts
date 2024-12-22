// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NominatorReward, PoolReward } from './types'

export const isPoolReward = (
  p: PoolReward | NominatorReward
): p is PoolReward => 'poolId' in p

export const isNominatorReward = (
  p: PoolReward | NominatorReward
): p is NominatorReward => !isPoolReward(p)
