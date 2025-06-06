// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  AccountBalance,
  MaybeAddress,
  PoolMembershipState,
  StakingLedger,
} from 'types'

export interface BalancesContextInterface {
  getAccountBalance: (address: MaybeAddress) => AccountBalance
  getStakingLedger: (address: MaybeAddress) => StakingLedger
  getPoolMembership: (address: MaybeAddress) => PoolMembershipState
  getNominations: (address: MaybeAddress) => string[]
  getEdReserved: (address: MaybeAddress) => bigint
  getPendingPoolRewards: (address: MaybeAddress) => bigint
}

export interface UnlockChunk {
  era: number
  value: bigint
}
