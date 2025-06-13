// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { maxBigInt } from '@w3ux/utils'
import type {
  AccountBalance,
  AllBalances,
  NominatorBalances,
  PoolBalances,
  PoolMembership,
  StakingLedger,
  UnlockChunk,
} from 'types'

// Gets the total unlocking and unlocked amount from unlock chunks
export const getUnlocking = (chunks: UnlockChunk[], currentEra: number) => {
  let totalUnlocking = 0n
  let totalUnlocked = 0n

  for (const { value, era } of chunks) {
    if (currentEra > era) {
      totalUnlocked = totalUnlocked + value
    } else {
      totalUnlocking = totalUnlocking + value
    }
  }
  return { totalUnlocking, totalUnlocked }
}

// Calculate free balance after existential deposit reserve
const getFreeBalance = (
  accountBalance: AccountBalance,
  edReserved: bigint
): bigint => {
  const { free } = accountBalance.balance
  return maxBigInt(free - edReserved, 0n)
}

// Calculate transferable balance (free minus fees, unlocking, and unlocked amounts)
const getTransferrableBalance = (
  freeBalance: bigint,
  feeReserve: bigint,
  totalUnlocking: bigint,
  totalUnlocked: bigint
): bigint =>
  maxBigInt(freeBalance - feeReserve - totalUnlocking - totalUnlocked, 0n)

// Calculate balance available for transaction fees
const balanceForTxFees = (
  accountBalance: AccountBalance,
  edReserved: bigint
): bigint => {
  const { free } = accountBalance.balance
  return maxBigInt(free - edReserved, 0n)
}

// Calculate nominator balances from staking ledger and transferable balance
const nominatorBalances = (
  stakingLedger: StakingLedger,
  transferableBalance: bigint,
  currentEra: number
): NominatorBalances => {
  const { active, total } = stakingLedger.ledger || {
    active: 0n,
    total: 0n,
  }
  const unlocking = stakingLedger.ledger?.unlocking || []

  const { totalUnlocking, totalUnlocked } = getUnlocking(unlocking, currentEra)
  const totalPossibleBond = total + transferableBalance

  return {
    active,
    totalUnlocking,
    totalUnlocked,
    totalPossibleBond,
    totalAdditionalBond: maxBigInt(totalPossibleBond - total, 0n),
    totalUnlockChunks: unlocking.length,
  }
}

// Calculate pool balances from membership and account data
const poolBalances = (
  membership: PoolMembership | undefined,
  transferableBalance: bigint,
  maxReserve: bigint,
  currentEra: number
): PoolBalances => {
  const unlockingPool = (membership?.unbondingEras || []).map(
    ([era, value]) => ({
      era,
      value,
    })
  )
  const { totalUnlocking, totalUnlocked } = getUnlocking(
    unlockingPool,
    currentEra
  )

  return {
    active: membership?.balance || 0n,
    totalUnlocking,
    totalUnlocked,
    totalPossibleBond: maxBigInt(transferableBalance - maxReserve, 0n),
    totalUnlockChunks: unlockingPool.length,
  }
}

// Calculate total account balance including all staked funds
const getTotalBalance = (
  accountBalance: AccountBalance,
  nominatorActive: bigint,
  poolActive: bigint,
  poolUnlocking: bigint,
  poolUnlocked: bigint
): bigint => {
  const { free } = accountBalance.balance
  return free + nominatorActive + poolActive + poolUnlocking + poolUnlocked
}

// Calculate locked balance (max of frozen/reserved minus actively staking)
const getLockedBalance = (
  accountBalance: AccountBalance,
  nominatorActive: bigint,
  poolTotal: bigint
): bigint => {
  const { frozen, reserved } = accountBalance.balance
  const maxReserve = maxBigInt(frozen, reserved)
  return maxBigInt(maxReserve - nominatorActive - poolTotal, 0n)
}

// Comprehensive balance calculation function
export const calculateAllBalances = (
  accountBalance: AccountBalance,
  stakingLedger: StakingLedger,
  membership: PoolMembership | undefined,
  edReserved: bigint,
  feeReserve: bigint,
  currentEra: number
): AllBalances => {
  const { frozen, reserved } = accountBalance.balance
  const maxReserve = maxBigInt(frozen, reserved)

  // Calculate basic balances
  const freeBalance = getFreeBalance(accountBalance, edReserved)
  const balanceTxFees = balanceForTxFees(accountBalance, edReserved)

  // Calculate nominator balances first (needed for transferable calculation)
  const {
    totalUnlocking: nominatorUnlocking,
    totalUnlocked: nominatorUnlocked,
  } = getUnlocking(stakingLedger?.ledger?.unlocking || [], currentEra)

  // Calculate transferable balance
  const transferableBalance = getTransferrableBalance(
    freeBalance,
    feeReserve,
    nominatorUnlocking,
    nominatorUnlocked
  )

  // Calculate detailed balances
  const nominator = nominatorBalances(
    stakingLedger,
    transferableBalance,
    currentEra
  )

  const pool = poolBalances(
    membership,
    transferableBalance,
    maxReserve,
    currentEra
  )

  // Calculate total and locked balances
  const totalBalance = getTotalBalance(
    accountBalance,
    nominator.active,
    pool.active,
    pool.totalUnlocking,
    pool.totalUnlocked
  )

  const poolTotal = pool.active + pool.totalUnlocking + pool.totalUnlocked
  const lockedBalance = getLockedBalance(
    accountBalance,
    nominator.active,
    poolTotal
  )

  return {
    freeBalance,
    transferableBalance,
    balanceTxFees,
    edReserved,
    totalBalance,
    lockedBalance,
    nominator,
    pool,
  }
}
