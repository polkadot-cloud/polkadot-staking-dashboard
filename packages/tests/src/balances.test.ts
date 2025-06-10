// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  calculateAllBalances,
  calculateBalanceTxFees,
  calculateFreeBalance,
  calculateLockedBalance,
  calculateNominatorBalances,
  calculatePoolBalances,
  calculateTotalBalance,
  calculateTransferableBalance,
  getUnlocking,
  maxBigInt,
  minBigInt,
} from 'utils'
import { expect, test } from 'vitest'

// Mock data for testing
const mockAccountBalance = {
  synced: true,
  nonce: 1,
  balance: {
    free: 1000000000000000n, // 1000 DOT
    reserved: 20000000000000n, // 20 DOT
    frozen: 50000000000000n, // 50 DOT
  },
}

const mockStakingLedger = {
  ledger: {
    stash: 'test-address',
    total: 500000000000000n, // 500 DOT
    active: 400000000000000n, // 400 DOT
    unlocking: [
      { era: 102, value: 50000000000000n }, // 50 DOT unlocking (era > current)
      { era: 99, value: 50000000000000n }, // 50 DOT unlocked (era <= current)
    ],
  },
  payee: undefined,
  nominators: undefined,
  controllerUnmigrated: false,
}

const mockPoolMembership = {
  address: 'test-address',
  poolId: 1,
  points: 300000000000000n,
  balance: 300000000000000n, // 300 DOT
  lastRecordedRewardCounter: 0n,
  unbondingEras: [
    [102, 30000000000000n], // 30 DOT unlocking
    [98, 20000000000000n], // 20 DOT unlocked (past era)
  ] as [number, bigint][],
  claimPermission: 'Permissioned',
  pendingRewards: 5000000000000n, // 5 DOT
}

const currentEra = 101
const edReserved = 10000000000000n // 10 DOT
const feeReserve = 5000000000000n // 5 DOT

test('maxBigInt returns the larger value', () => {
  expect(maxBigInt(100n, 200n)).toBe(200n)
  expect(maxBigInt(300n, 200n)).toBe(300n)
  expect(maxBigInt(100n, 100n)).toBe(100n)
})

test('minBigInt returns the smaller value', () => {
  expect(minBigInt(100n, 200n)).toBe(100n)
  expect(minBigInt(300n, 200n)).toBe(200n)
  expect(minBigInt(100n, 100n)).toBe(100n)
})

test('getUnlocking correctly separates unlocking and unlocked amounts', () => {
  const chunks = [
    { era: 102, value: 50000000000000n }, // unlocking (era > current)
    { era: 99, value: 30000000000000n }, // unlocked (era <= current)
    { era: 103, value: 20000000000000n }, // unlocking (era > current)
    { era: 98, value: 10000000000000n }, // unlocked (era <= current)
  ]

  const result = getUnlocking(chunks, 101)
  expect(result.totalUnlocking).toBe(70000000000000n) // 50 + 20 (eras 102, 103)
  expect(result.totalUnlocked).toBe(40000000000000n) // 30 + 10 (eras 99, 98)
})

test('getUnlocking handles empty chunks', () => {
  const result = getUnlocking([], 101)
  expect(result.totalUnlocking).toBe(0n)
  expect(result.totalUnlocked).toBe(0n)
})

test('calculateFreeBalance subtracts ED reserve from free balance', () => {
  const result = calculateFreeBalance(mockAccountBalance, edReserved)
  expect(result).toBe(990000000000000n) // 1000 - 10
})

test('calculateFreeBalance handles insufficient balance', () => {
  const insufficientBalance = {
    ...mockAccountBalance,
    balance: { ...mockAccountBalance.balance, free: 5000000000000n }, // 5 DOT
  }
  const result = calculateFreeBalance(insufficientBalance, edReserved)
  expect(result).toBe(0n) // max(5 - 10, 0) = 0
})

test('calculateTransferableBalance subtracts all locked amounts', () => {
  const freeBalance = 990000000000000n
  const totalUnlocking = 50000000000000n
  const totalUnlocked = 50000000000000n

  const result = calculateTransferableBalance(
    freeBalance,
    feeReserve,
    totalUnlocking,
    totalUnlocked
  )
  expect(result).toBe(885000000000000n) // 990 - 5 - 50 - 50
})

test('calculateTransferableBalance handles insufficient balance', () => {
  const result = calculateTransferableBalance(
    10000000000000n, // 10 DOT
    feeReserve,
    50000000000000n,
    50000000000000n
  )
  expect(result).toBe(0n) // max(10 - 5 - 50 - 50, 0) = 0
})

test('calculateBalanceTxFees equals calculateFreeBalance', () => {
  const result = calculateBalanceTxFees(mockAccountBalance, edReserved)
  expect(result).toBe(990000000000000n) // 1000 - 10
})

test('calculateNominatorBalances calculates all nominator-related balances', () => {
  const transferableBalance = 885000000000000n
  const result = calculateNominatorBalances(
    mockStakingLedger,
    transferableBalance,
    currentEra
  )

  expect(result.active).toBe(400000000000000n)
  expect(result.totalUnlocking).toBe(50000000000000n) // era 102 > 101
  expect(result.totalUnlocked).toBe(50000000000000n) // era 99 <= 101
  expect(result.totalPossibleBond).toBe(1385000000000000n) // 500 + 885
  expect(result.totalAdditionalBond).toBe(885000000000000n) // 1385 - 500
  expect(result.totalUnlockChunks).toBe(2)
})

test('calculateNominatorBalances handles undefined ledger', () => {
  const ledgerUndefined = {
    ledger: undefined,
    payee: undefined,
    nominators: undefined,
    controllerUnmigrated: false,
  }

  const result = calculateNominatorBalances(
    ledgerUndefined,
    885000000000000n,
    currentEra
  )

  expect(result.active).toBe(0n)
  expect(result.totalUnlocking).toBe(0n)
  expect(result.totalUnlocked).toBe(0n)
  expect(result.totalPossibleBond).toBe(885000000000000n)
  expect(result.totalAdditionalBond).toBe(885000000000000n)
  expect(result.totalUnlockChunks).toBe(0)
})

test('calculatePoolBalances calculates all pool-related balances', () => {
  const transferableBalance = 885000000000000n
  const maxReserve = 50000000000000n

  const result = calculatePoolBalances(
    mockPoolMembership,
    transferableBalance,
    maxReserve,
    currentEra
  )

  expect(result.active).toBe(300000000000000n)
  expect(result.totalUnlocking).toBe(30000000000000n) // era 102
  expect(result.totalUnlocked).toBe(20000000000000n) // era 98
  expect(result.totalPossibleBond).toBe(835000000000000n) // 885 - 50
  expect(result.totalUnlockChunks).toBe(2)
})

test('calculatePoolBalances handles undefined membership', () => {
  const result = calculatePoolBalances(
    undefined,
    885000000000000n,
    50000000000000n,
    currentEra
  )

  expect(result.active).toBe(0n)
  expect(result.totalUnlocking).toBe(0n)
  expect(result.totalUnlocked).toBe(0n)
  expect(result.totalPossibleBond).toBe(835000000000000n)
  expect(result.totalUnlockChunks).toBe(0)
})

test('calculateTotalBalance sums all account balances', () => {
  const nominatorActive = 400000000000000n
  const poolActive = 300000000000000n
  const poolUnlocking = 30000000000000n
  const poolUnlocked = 20000000000000n

  const result = calculateTotalBalance(
    mockAccountBalance,
    nominatorActive,
    poolActive,
    poolUnlocking,
    poolUnlocked
  )

  expect(result).toBe(1750000000000000n) // 1000 + 400 + 300 + 30 + 20
})

test('calculateLockedBalance calculates locked funds correctly', () => {
  const nominatorActive = 400000000000000n
  const poolTotal = 350000000000000n // 300 + 30 + 20

  const result = calculateLockedBalance(
    mockAccountBalance,
    nominatorActive,
    poolTotal
  )

  // maxReserve = max(50, 20) = 50
  // locked = max(50 - 400 - 350, 0) = 0
  expect(result).toBe(0n)
})

test('calculateLockedBalance with higher reserves', () => {
  const highReserveBalance = {
    ...mockAccountBalance,
    balance: {
      ...mockAccountBalance.balance,
      frozen: 800000000000000n, // 800 DOT
      reserved: 100000000000000n, // 100 DOT
    },
  }

  const result = calculateLockedBalance(
    highReserveBalance,
    400000000000000n,
    350000000000000n
  )

  // maxReserve = max(800, 100) = 800
  // locked = max(800 - 400 - 350, 0) = 50
  expect(result).toBe(50000000000000n)
})

test('calculateAllBalances provides comprehensive balance calculations', () => {
  const result = calculateAllBalances(
    mockAccountBalance,
    mockStakingLedger,
    mockPoolMembership,
    edReserved,
    feeReserve,
    currentEra
  )

  // Verify all calculated fields
  expect(result.freeBalance).toBe(990000000000000n) // 1000 - 10
  expect(result.transferableBalance).toBe(885000000000000n) // 990 - 5 - 50 - 50
  expect(result.balanceTxFees).toBe(990000000000000n) // 1000 - 10
  expect(result.edReserved).toBe(edReserved)

  // Verify nominator balances
  expect(result.nominator.active).toBe(400000000000000n)
  expect(result.nominator.totalUnlocking).toBe(50000000000000n)
  expect(result.nominator.totalUnlocked).toBe(50000000000000n)
  expect(result.nominator.totalPossibleBond).toBe(1385000000000000n)
  expect(result.nominator.totalAdditionalBond).toBe(885000000000000n)
  expect(result.nominator.totalUnlockChunks).toBe(2)

  // Verify pool balances
  expect(result.pool.active).toBe(300000000000000n)
  expect(result.pool.totalUnlocking).toBe(30000000000000n)
  expect(result.pool.totalUnlocked).toBe(20000000000000n)
  expect(result.pool.totalPossibleBond).toBe(835000000000000n) // 885 - 50
  expect(result.pool.totalUnlockChunks).toBe(2)

  // Verify total and locked
  expect(result.totalBalance).toBe(1750000000000000n)
  expect(result.lockedBalance).toBe(0n)
})

test('calculateAllBalances handles edge cases with zero balances', () => {
  const zeroBalance = {
    synced: true,
    nonce: 0,
    balance: {
      free: 0n,
      reserved: 0n,
      frozen: 0n,
    },
  }

  const emptyLedger = {
    ledger: undefined,
    payee: undefined,
    nominators: undefined,
    controllerUnmigrated: false,
  }

  const result = calculateAllBalances(
    zeroBalance,
    emptyLedger,
    undefined,
    0n,
    0n,
    currentEra
  )

  expect(result.freeBalance).toBe(0n)
  expect(result.transferableBalance).toBe(0n)
  expect(result.balanceTxFees).toBe(0n)
  expect(result.totalBalance).toBe(0n)
  expect(result.lockedBalance).toBe(0n)
  expect(result.nominator.active).toBe(0n)
  expect(result.pool.active).toBe(0n)
})

export {}
