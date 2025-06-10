// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalance, PoolMembership, StakingLedger } from 'types'

// Utility to get maximum of two bigint values
export const maxBigInt = (a: bigint, b: bigint): bigint => (a > b ? a : b)

// Utility to get minimum of two bigint values
export const minBigInt = (a: bigint, b: bigint): bigint => (a < b ? a : b)

// Interface for unlock chunks
export interface UnlockChunk {
  era: number
  value: bigint
}

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
export const calculateFreeBalance = (
  accountBalance: AccountBalance,
  edReserved: bigint
): bigint => {
  const { free } = accountBalance.balance
  return maxBigInt(free - edReserved, 0n)
}

// Calculate transferable balance (free minus fees, unlocking, and unlocked amounts)
export const calculateTransferableBalance = (
  freeBalance: bigint,
  feeReserve: bigint,
  totalUnlocking: bigint,
  totalUnlocked: bigint
): bigint =>
  maxBigInt(freeBalance - feeReserve - totalUnlocking - totalUnlocked, 0n)

// Calculate balance available for transaction fees
export const calculateBalanceTxFees = (
  accountBalance: AccountBalance,
  edReserved: bigint
): bigint => {
  const { free } = accountBalance.balance
  return maxBigInt(free - edReserved, 0n)
}

// Interface for nominator balance calculations
export interface NominatorBalances {
  active: bigint
  totalUnlocking: bigint
  totalUnlocked: bigint
  totalPossibleBond: bigint
  totalAdditionalBond: bigint
  totalUnlockChunks: number
}

// Calculate nominator balances from staking ledger and transferable balance
export const calculateNominatorBalances = (
  stakingLedger: StakingLedger,
  transferableBalance: bigint,
  currentEra: number
): NominatorBalances => {
  const { active, total } = stakingLedger.ledger || {
    active: 0n,
    total: 0n,
  }
  const unlocking = stakingLedger?.ledger?.unlocking || []

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

// Interface for pool balance calculations
export interface PoolBalances {
  active: bigint
  totalUnlocking: bigint
  totalUnlocked: bigint
  totalPossibleBond: bigint
  totalUnlockChunks: number
}

// Calculate pool balances from membership and account data
export const calculatePoolBalances = (
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
export const calculateTotalBalance = (
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
export const calculateLockedBalance = (
  accountBalance: AccountBalance,
  nominatorActive: bigint,
  poolTotal: bigint
): bigint => {
  const { frozen, reserved } = accountBalance.balance
  const maxReserve = maxBigInt(frozen, reserved)
  return maxBigInt(maxReserve - nominatorActive - poolTotal, 0n)
}

// Interface for comprehensive balance calculations
export interface BalanceCalculations {
  freeBalance: bigint
  transferableBalance: bigint
  balanceTxFees: bigint
  edReserved: bigint
  totalBalance: bigint
  lockedBalance: bigint
  nominator: NominatorBalances
  pool: PoolBalances
}

// Comprehensive balance calculation function
export const calculateAllBalances = (
  accountBalance: AccountBalance,
  stakingLedger: StakingLedger,
  membership: PoolMembership | undefined,
  edReserved: bigint,
  feeReserve: bigint,
  currentEra: number
): BalanceCalculations => {
  const { frozen, reserved } = accountBalance.balance
  const maxReserve = maxBigInt(frozen, reserved)

  // Calculate basic balances
  const freeBalance = calculateFreeBalance(accountBalance, edReserved)
  const balanceTxFees = calculateBalanceTxFees(accountBalance, edReserved)

  // Calculate nominator balances first (needed for transferable calculation)
  const {
    totalUnlocking: nominatorUnlocking,
    totalUnlocked: nominatorUnlocked,
  } = getUnlocking(stakingLedger?.ledger?.unlocking || [], currentEra)

  // Calculate transferable balance
  const transferableBalance = calculateTransferableBalance(
    freeBalance,
    feeReserve,
    nominatorUnlocking,
    nominatorUnlocked
  )

  // Calculate detailed balances
  const nominator = calculateNominatorBalances(
    stakingLedger,
    transferableBalance,
    currentEra
  )

  const pool = calculatePoolBalances(
    membership,
    transferableBalance,
    maxReserve,
    currentEra
  )

  // Calculate total and locked balances
  const totalBalance = calculateTotalBalance(
    accountBalance,
    nominator.active,
    pool.active,
    pool.totalUnlocking,
    pool.totalUnlocked
  )

  const poolTotal = pool.active + pool.totalUnlocking + pool.totalUnlocked
  const lockedBalance = calculateLockedBalance(
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
