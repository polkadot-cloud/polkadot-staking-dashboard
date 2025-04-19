// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolsConfig } from 'types'

export const defaultPoolsConfig: PoolsConfig = {
  counterForPoolMembers: 0,
  counterForBondedPools: 0,
  counterForRewardPools: 0,
  lastPoolId: 0,
  maxPoolMembers: 0,
  maxPoolMembersPerPool: 0,
  maxPools: 0,
  minCreateBond: 0n,
  minJoinBond: 0n,
  globalMaxCommission: 0,
}
