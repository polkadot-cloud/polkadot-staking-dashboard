import type { NominatorReward, PoolReward } from './types'

export const isPoolReward = (
  p: PoolReward | NominatorReward
): p is PoolReward => 'poolId' in p

export const isNominatorReward = (
  p: PoolReward | NominatorReward
): p is NominatorReward => !isPoolReward(p)
