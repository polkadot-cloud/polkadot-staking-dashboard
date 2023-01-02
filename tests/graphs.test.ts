/* Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
 * SPDX-License-Identifier: Apache-2.0 */

import { fromUnixTime, getUnixTime, startOfToday, subDays } from 'date-fns';
import {
  daysPassed,
  normalisePayouts,
  postFillMissingDays,
  prefillMissingDays,
} from 'library/Graphs/Utils';

// payouts that were made 2, 3 and 4 days ago.
const mockPayouts: any = [
  {
    amount: '10000000000',
    block_timestamp: getUnixTime(subDays(new Date(), 2)),
  },
  {
    amount: '15000000000',
    block_timestamp: getUnixTime(subDays(new Date(), 3)),
  },
  {
    amount: '5000000000',
    block_timestamp: getUnixTime(subDays(new Date(), 4)),
  },
];

// Get the correct amount of days passed between 2 payout timestamps.
//
// `daysPassed` is a utility function that is used throughout the graph data accumulation process.
test('days passed works', () => {
  const payouts = normalisePayouts(mockPayouts);
  expect(
    daysPassed(fromUnixTime(payouts[0].block_timestamp), startOfToday())
  ).toBe(2);
  expect(
    daysPassed(fromUnixTime(payouts[1].block_timestamp), startOfToday())
  ).toBe(3);
  expect(
    daysPassed(fromUnixTime(payouts[2].block_timestamp), startOfToday())
  ).toBe(4);
});

// Fill missing days from the latest payout to the current day.
//
// Note that the latest payout is assumed to be the first in the payout list.
test('post fill missing days works', () => {
  //  p0,  p1,  p2,   p3,   p4,  p5,   p6
  //  -    -    x     x     x    0     0
  const payouts = normalisePayouts(mockPayouts);
  const maxDays = 7;

  // post fill the missing days for mock payouts.
  const missingDays = postFillMissingDays(payouts, maxDays);

  // amount of missing days returned should be correct.
  expect(missingDays.length).toBe(2);

  // concatenated payouts are correct
  const concatPayouts = missingDays.concat(payouts);

  for (let i = 0; i < concatPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(concatPayouts[i].block_timestamp),
          fromUnixTime(concatPayouts[i - 1].block_timestamp)
        )
      ).toBe(1);
      expect(concatPayouts[i].block_timestamp).toBeLessThan(
        concatPayouts[i - 1].block_timestamp
      );
    }
  }
});

// Fill missing days from the earliest payout to the current day.
//
// Note that the earliest payout is assumed to be the last in the payout list.
test('pre fill missing days works', () => {
  //  p0,  p1,  p2,   p3,   p4,   p5,   p6
  //            x     x     x     -     -
  const payouts = normalisePayouts(mockPayouts);
  const maxDays = 7;

  // max amount of missing days to process should be correct.
  expect(daysPassed(subDays(new Date(), 28), new Date())).toBe(28);
  expect(daysPassed(subDays(new Date(), 17), new Date())).toBe(17);
  expect(daysPassed(subDays(new Date(), 9), new Date())).toBe(9);

  // post fill the missing days for mock payouts.
  const missingDays = prefillMissingDays(payouts, maxDays);

  // expect amount of missing days to be 2
  expect(missingDays.length).toBe(2);

  // concatenated payouts are correct
  const concatPayouts = payouts.concat(missingDays);

  for (let i = 0; i < concatPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(concatPayouts[i].block_timestamp),
          fromUnixTime(concatPayouts[i - 1].block_timestamp)
        )
      ).toBe(1);

      expect(concatPayouts[i].block_timestamp).toBeLessThan(
        concatPayouts[i - 1].block_timestamp
      );
    }
  }
});

// Use post-fill and pre-fill together.
//
// Test filling days from both directions.
test('pre fill and post fill missing days work together', () => {
  //  p0,  p1,  p2,   p3,   p4,   p5,   p6
  //  -    -    x     x     x     -     -

  const payouts = normalisePayouts(mockPayouts);
  const maxDays = 7;

  // post fill the missing days for mock payouts.
  const missingPostDays = postFillMissingDays(payouts, maxDays);
  const missingPreDays = prefillMissingDays(payouts, maxDays);

  const finalPayouts = missingPostDays.concat(payouts).concat(missingPreDays);

  // expect amount of missing days to be 7
  expect(finalPayouts.length).toBe(7);

  // concatenated payouts are correct
  for (let i = 0; i < finalPayouts.length; i++) {
    if (i > 0) {
      expect(
        daysPassed(
          fromUnixTime(finalPayouts[i].block_timestamp),
          fromUnixTime(finalPayouts[i - 1].block_timestamp)
        )
      ).toBe(1);

      expect(finalPayouts[i].block_timestamp).toBeLessThan(
        finalPayouts[i - 1].block_timestamp
      );
    }
  }
});

export {};
