// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { StakingMetrics } from 'types'

export const defaultStakingMetrics: StakingMetrics = {
  erasToCheckPerBlock: 0,
  minimumActiveStake: 0n,
  counterForValidators: 0,
  maxValidatorsCount: undefined,
  validatorCount: 0,
  lastReward: undefined,
  lastTotalStake: 0n,
  minNominatorBond: 0n,
  totalStaked: 0n,
  counterForNominators: 0,
}
