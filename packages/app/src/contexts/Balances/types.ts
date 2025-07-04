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
  getEdReserved: () => bigint
  getPendingPoolRewards: (address: MaybeAddress) => bigint
  feeReserve: bigint
  setFeeReserveBalance: (reserve: bigint) => void
}
