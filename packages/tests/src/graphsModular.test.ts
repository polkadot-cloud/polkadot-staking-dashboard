// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getUnixTime, subDays } from 'date-fns'
import {
  calculateDailyPayoutsWithConfig,
  formatRewardsForGraphsWithConfig,
  normalisePayouts,
  processPayoutsWithConfig,
} from 'ui-graphs'
import { expect, test } from 'vitest'

// Test the new config-based APIs to ensure they work alongside the old ones
const mockPayouts = [
  {
    who: '',
    poolId: 0,
    reward: '10000000000',
    timestamp: getUnixTime(subDays(new Date(), 2)),
  },
  {
    who: '',
    poolId: 0,
    reward: '15000000000',
    timestamp: getUnixTime(subDays(new Date(), 3)),
  },
  {
    who: '',
    poolId: 0,
    reward: '5000000000',
    timestamp: getUnixTime(subDays(new Date(), 4)),
  },
]

test('new config-based APIs work correctly', () => {
  const payouts = normalisePayouts(mockPayouts)
  const fromDate = new Date()
  const maxDays = 7
  const units = 10

  // Test calculateDailyPayoutsWithConfig
  const dailyPayouts = calculateDailyPayoutsWithConfig({
    payouts,
    fromDate,
    maxDays,
    units,
    subject: 'nominate',
  })

  expect(Array.isArray(dailyPayouts)).toBe(true)

  // Test processPayoutsWithConfig
  const processedPayouts = processPayoutsWithConfig({
    payouts,
    fromDate,
    days: maxDays,
    units,
    subject: 'nominate',
  })

  expect(processedPayouts).toHaveProperty('p')
  expect(processedPayouts).toHaveProperty('a')
  expect(Array.isArray(processedPayouts.p)).toBe(true)
  expect(Array.isArray(processedPayouts.a)).toBe(true)

  // Test formatRewardsForGraphsWithConfig
  const formatted = formatRewardsForGraphsWithConfig({
    fromDate,
    days: maxDays,
    units,
    payouts: mockPayouts,
    poolClaims: [],
    unclaimedPayouts: [],
  })

  expect(formatted).toHaveProperty('allPayouts')
  expect(formatted).toHaveProperty('allUnclaimedPayouts')
  expect(formatted).toHaveProperty('allPoolClaims')
  expect(formatted).toHaveProperty('lastReward')
})

export {}
