// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only */

import { fromUnixTime, getUnixTime, startOfToday, subDays } from 'date-fns'
import {
  daysPassed,
  normalisePayouts,
  postFillMissingDays,
  prefillMissingDays,
} from 'library/Graphs/Utils'
import { expect, test } from 'vitest'

// payouts that were made 2, 3 and 4 days ago.
const mockPayouts = [
  {
    reward: '10000000000',
    timestamp: getUnixTime(subDays(new Date(), 2)),
  },
  {
    reward: '15000000000',
    timestamp: getUnixTime(subDays(new Date(), 3)),
  },
  {
    reward: '5000000000',
    timestamp: getUnixTime(subDays(new Date(), 4)),
  },
]

// Get the correct reward of days passed between 2 payout timestamps.
//
// `daysPassed` is a utility function that is used throughout the graph data accumulation process.
test('days passed works', () => {
  const payouts = normalisePayouts(mockPayouts)
  // days passed works on `mockPayouts`.
  expect(daysPassed(fromUnixTime(payouts[0].timestamp), startOfToday())).toBe(2)
  expect(daysPassed(fromUnixTime(payouts[1].timestamp), startOfToday())).toBe(3)
  expect(daysPassed(fromUnixTime(payouts[2].timestamp), startOfToday())).toBe(4)

  // max reward of missing days to process should be correct.
  for (let i = 1; i < 368; i++) {
    expect(daysPassed(subDays(new Date(), i), new Date())).toBe(i)
  }
})

// Fill missing days from the latest payout to the current day.
//
// Note that the latest payout is assumed to be the first in the payout list.
test('post fill missing days works', () => {
  //  p0,  p1,  p2,   p3,   p4,  p5,   p6
  //  -    -    x     x     x    0     0
  const payouts = normalisePayouts(mockPayouts)
  const fromDate = new Date()
  const maxDays = 7

  // post fill the missing days for mock payouts.
  const missingDays = postFillMissingDays(payouts, fromDate, maxDays)

  // reward of missing days returned should be correct.
  expect(missingDays.length).toBe(2)

  // concatenated payouts are correct
  const concatPayouts = missingDays.concat(payouts)

  // days passed and ordering are correct.
  for (let i = 0; i < concatPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(concatPayouts[i].timestamp),
          fromUnixTime(concatPayouts[i - 1].timestamp)
        )
      ).toBe(1)
      expect(concatPayouts[i].timestamp).toBeLessThan(
        concatPayouts[i - 1].timestamp
      )
    }
  }
})

// Fill missing days from the earliest payout to the current day.
//
// Note that the earliest payout is assumed to be the last in the payout list.
test('pre fill missing days works', () => {
  //  p0,  p1,  p2,   p3,   p4,   p5,   p6
  //            x     x     x     -     -
  const payouts = normalisePayouts(mockPayouts)
  const fromDate = new Date()
  const maxDays = 7

  // post fill the missing days for mock payouts.
  const missingDays = prefillMissingDays(payouts, fromDate, maxDays)

  // expect reward of missing days to be 2
  expect(missingDays.length).toBe(2)

  // concatenated payouts are correct
  const concatPayouts = payouts.concat(missingDays)

  // days passed and ordering are correct.
  for (let i = 0; i < concatPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(concatPayouts[i].timestamp),
          fromUnixTime(concatPayouts[i - 1].timestamp)
        )
      ).toBe(1)
      expect(concatPayouts[i].timestamp).toBeLessThan(
        concatPayouts[i - 1].timestamp
      )
    }
  }
})

// Use post-fill and pre-fill together.
//
// Test filling days from both directions.
test('pre fill and post fill missing days work together', () => {
  //  p0,  p1,  p2,   p3,   p4,   p5,   p6,   p7,   p8,   p9
  //  -    -    x     x     x     -     -     -     -     -
  const payouts = normalisePayouts(mockPayouts)
  const fromDate = new Date()
  const maxDays = 10

  // post fill the missing days for mock payouts.
  const missingPostDays = postFillMissingDays(payouts, fromDate, maxDays)
  expect(missingPostDays.length).toBe(2)

  const missingPreDays = prefillMissingDays(payouts, fromDate, maxDays)
  expect(missingPreDays.length).toBe(5)

  const finalPayouts = missingPostDays.concat(payouts).concat(missingPreDays)
  expect(finalPayouts.length).toBe(10)

  // days passed and ordering are correct.
  for (let i = 0; i < finalPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(finalPayouts[i].timestamp),
          fromUnixTime(finalPayouts[i - 1].timestamp)
        )
      ).toBe(1)
      expect(finalPayouts[i].timestamp).toBeLessThan(
        finalPayouts[i - 1].timestamp
      )
    }
  }
})

export {}
