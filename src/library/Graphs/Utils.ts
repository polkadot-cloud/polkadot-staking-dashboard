// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero, planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import {
  addDays,
  differenceInDays,
  fromUnixTime,
  getUnixTime,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns';
import { MaxPayoutDays } from 'consts';
import type { AnyApi, AnyJson, AnySubscan } from 'types';
import type { PayoutDayCursor } from './types';

// Given payouts, calculate daily income and fill missing days with zero amounts.
export const calculateDailyPayouts = (
  payouts: AnySubscan,
  fromDate: Date,
  maxDays: number,
  units: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subject: string
) => {
  let dailyPayouts: AnySubscan = [];

  // remove days that are beyond end day limit
  payouts = payouts.filter(
    (p: AnySubscan) =>
      daysPassed(fromUnixTime(p.block_timestamp), fromDate) <= maxDays
  );

  // return now if no payouts.
  if (!payouts.length) {
    return payouts;
  }

  // post-fill any missing days. [current day -> last payout]
  dailyPayouts = postFillMissingDays(payouts, fromDate, maxDays);

  // start iterating payouts, most recent first.
  //
  // payouts passed.
  let p = 0;
  // current day cursor.
  let curDay: Date = fromDate;
  // current payout cursor.
  let curPayout: PayoutDayCursor = {
    amount: new BigNumber(0),
    event_id: '',
  };
  for (const payout of payouts) {
    p++;

    // extract day from current payout.
    const thisDay = startOfDay(fromUnixTime(payout.block_timestamp));

    // initialise current day if first payout.
    if (p === 1) {
      curDay = thisDay;
    }

    // handle surpassed maximum days.
    if (daysPassed(thisDay, fromDate) >= maxDays) {
      dailyPayouts.push({
        amount: planckToUnit(curPayout.amount, units),
        event_id: getEventId(curPayout),
        block_timestamp: getUnixTime(curDay),
      });
      break;
    }

    // get day difference between cursor and current payout.
    const daysDiff = daysPassed(thisDay, curDay);

    // handle new day.
    if (daysDiff > 0) {
      // add current payout cursor to dailyPayouts.
      dailyPayouts.push({
        amount: planckToUnit(curPayout.amount, units),
        event_id: getEventId(curPayout),
        block_timestamp: getUnixTime(curDay),
      });

      // update day cursor to the new day.
      curDay = thisDay;
      // reset current payout cursor for the new day.
      curPayout = {
        amount: new BigNumber(payout.amount),
        event_id: new BigNumber(payout.amount).isLessThan(0)
          ? 'Slash'
          : 'Reward',
      };
    } else {
      // in same day. Aadd payout amount to current payout cursor.
      curPayout.amount = curPayout.amount.plus(payout.amount);
    }

    // if only 1 payout exists, or at the last unresolved payout, exit here.
    if (
      payouts.length === 1 ||
      (p === payouts.length && !curPayout.amount.isZero())
    ) {
      dailyPayouts.push({
        amount: planckToUnit(curPayout.amount, units),
        event_id: getEventId(curPayout),
        block_timestamp: getUnixTime(curDay),
      });
      break;
    }
  }

  // return payout amounts as plain numbers.
  return dailyPayouts.map((q: AnyApi) => ({
    ...q,
    amount: Number(q.amount.toString()),
  }));
};

// Calculate average payouts per day.
export const calculatePayoutAverages = (
  payouts: AnySubscan,
  fromDate: Date,
  days: number,
  avgDays: number
) => {
  // if we don't need to take an average, just return `payouts`.
  if (avgDays <= 1) {
    return payouts;
  }

  // create moving average value over `avgDays` past days, if any.
  let payoutsAverages = [];
  for (let i = 0; i < payouts.length; i++) {
    // average period end.
    const end = Math.max(0, i - avgDays);

    // the total amount earned in period.
    let total = 0;
    // period length to be determined.
    let num = 0;

    for (let j = i; j >= end; j--) {
      if (payouts[j]) {
        total += payouts[j].amount;
      }
      // increase by one to treat non-existent as zero value
      num += 1;
    }

    if (total === 0) {
      total = payouts[i].amount;
    }

    payoutsAverages.push({
      amount: total / num,
      block_timestamp: payouts[i].block_timestamp,
    });
  }

  // return an array with the expected number of items
  payoutsAverages = payoutsAverages.filter(
    (p: AnySubscan) =>
      daysPassed(fromUnixTime(p.block_timestamp), fromDate) <= days
  );

  return payoutsAverages;
};

// Fetch rewards and graph meta data.
//
// Format provided payouts and returns the last payment.
export const formatRewardsForGraphs = (
  fromDate: Date,
  days: number,
  units: number,
  payouts: AnySubscan,
  poolClaims: AnySubscan,
  unclaimedPayouts: AnySubscan
) => {
  // process nominator payouts.
  const allPayouts = processPayouts(payouts, fromDate, days, units, 'nominate');

  // process unclaimed nominator payouts.
  const allUnclaimedPayouts = processPayouts(
    unclaimedPayouts,
    fromDate,
    days,
    units,
    'nominate'
  );

  // process pool claims.
  const allPoolClaims = processPayouts(
    poolClaims,
    fromDate,
    days,
    units,
    'pools'
  );

  return {
    // reverse rewards: most recent last
    allPayouts,
    allUnclaimedPayouts,
    allPoolClaims,
    lastReward: getLatestReward(payouts, poolClaims),
  };
};

// Process payouts.
//
// calls the relevant functions on raw payouts to format them correctly.
const processPayouts = (
  payouts: AnySubscan,
  fromDate: Date,
  days: number,
  units: number,
  subject: string
) => {
  // normalise payout timestamps.
  const normalised = normalisePayouts(payouts);
  // calculate payouts per day from the current day.
  let p = calculateDailyPayouts(normalised, fromDate, days, units, subject);
  // pre-fill payouts if max days have not been reached.
  p = p.concat(prefillMissingDays(p, fromDate, days));
  // fill in gap days between payouts with zero values.
  p = fillGapDays(p, fromDate);
  // reverse payouts: most recent last.
  p = p.reverse();

  // use normalised payouts for calculating the 10-day average prior to the start of the payout graph.
  const avgDays = 10;
  const preNormalised = getPreMaxDaysPayouts(
    normalised,
    fromDate,
    days,
    avgDays
  );
  // start of average calculation should be the earliest date.
  const averageFromDate = subDays(fromDate, MaxPayoutDays);

  let a = calculateDailyPayouts(
    preNormalised,
    averageFromDate,
    avgDays,
    units,
    subject
  );
  // prefill payouts if we are missing the earlier dates.
  a = a.concat(prefillMissingDays(a, averageFromDate, avgDays));
  // fill in gap days between payouts with zero values.
  a = fillGapDays(a, averageFromDate);
  // reverse payouts: most recent last.
  a = a.reverse();

  return { p, a };
};

// Get payout average in `avgDays` day period after to `days` threshold
//
// These payouts are used for calculating the `avgDays`-day average prior to the start of the payout
// graph.
const getPreMaxDaysPayouts = (
  payouts: AnySubscan,
  fromDate: Date,
  days: number,
  avgDays: number
) =>
  // remove payouts that are not within `avgDays` `days` pre-graph window.
  payouts.filter(
    (p: AnySubscan) =>
      daysPassed(fromUnixTime(p.block_timestamp), fromDate) > days &&
      daysPassed(fromUnixTime(p.block_timestamp), fromDate) <= days + avgDays
  );
// Combine payouts and pool claims.
//
// combines payouts and pool claims into daily records. Removes the `event_id` field from records.
export const combineRewards = (payouts: AnySubscan, poolClaims: AnySubscan) => {
  // we first check if actual payouts exist, e.g. there are non-zero payout
  // amounts present in either payouts or pool claims.
  const poolClaimExists =
    poolClaims.find((p: AnySubscan) => p.amount > 0) || null;
  const payoutExists = payouts.find((p: AnySubscan) => p.amount > 0) || null;

  // if no pool claims exist but payouts do, return payouts w.o. event_id
  // also do this if there are no payouts period.
  if (
    (!poolClaimExists && payoutExists) ||
    (!payoutExists && !poolClaimExists)
  ) {
    return payouts.map((p: AnySubscan) => ({
      amount: p.amount,
      block_timestamp: p.block_timestamp,
    }));
  }

  // if no payouts exist but pool claims do, return pool claims w.o. event_id
  if (!payoutExists && poolClaimExists) {
    return poolClaims.map((p: AnySubscan) => ({
      amount: p.amount,
      block_timestamp: p.block_timestamp,
    }));
  }

  // We now know pool claims *and* payouts exist.
  //
  // Now determine which dates to display.
  let payoutDays: AnyJson[] = [];
  // prefill `dates` with all pool claim and payout days
  poolClaims.forEach((p: AnySubscan) => {
    const dayStart = getUnixTime(startOfDay(fromUnixTime(p.block_timestamp)));
    if (!payoutDays.includes(dayStart)) {
      payoutDays.push(dayStart);
    }
  });
  payouts.forEach((p: AnySubscan) => {
    const dayStart = getUnixTime(startOfDay(fromUnixTime(p.block_timestamp)));
    if (!payoutDays.includes(dayStart)) {
      payoutDays.push(dayStart);
    }
  });

  // sort payoutDays by `block_timestamp`;
  payoutDays = payoutDays.sort((a: AnySubscan, b: AnySubscan) => a - b);

  // Iterate payout days.
  //
  // Combine payouts into one unified `rewards` array.
  const rewards: AnySubscan = [];

  // loop pool claims and consume / combine payouts
  payoutDays.forEach((d: AnySubscan) => {
    let amount = 0;

    // check payouts exist on this day
    const payoutsThisDay = payouts.filter((p: AnySubscan) =>
      isSameDay(fromUnixTime(p.block_timestamp), fromUnixTime(d))
    );
    // check pool claims exist on this day
    const poolClaimsThisDay = poolClaims.filter((p: AnySubscan) =>
      isSameDay(fromUnixTime(p.block_timestamp), fromUnixTime(d))
    );
    // add amounts
    if (payoutsThisDay.concat(poolClaimsThisDay).length) {
      for (const payout of payoutsThisDay) {
        amount += payout.amount;
      }
    }
    rewards.push({
      amount,
      block_timestamp: d,
    });
  });
  return rewards;
};

// Get latest reward.
//
// Gets the latest reward from pool claims and nominator payouts.
export const getLatestReward = (
  payouts: AnySubscan,
  poolClaims: AnySubscan
) => {
  // get most recent payout
  const payoutExists =
    payouts.find((p: AnySubscan) => greaterThanZero(new BigNumber(p.amount))) ??
    null;
  const poolClaimExists =
    poolClaims.find((p: AnySubscan) =>
      greaterThanZero(new BigNumber(p.amount))
    ) ?? null;

  // calculate which payout was most recent
  let lastReward = null;
  if (!payoutExists || !poolClaimExists) {
    if (payoutExists) {
      lastReward = payoutExists;
    }
    if (poolClaimExists) {
      lastReward = poolClaimExists;
    }
  } else {
    // both `payoutExists` and `poolClaimExists` are present
    lastReward =
      payoutExists.block_timestamp > poolClaimExists.block_timestamp
        ? payoutExists
        : poolClaimExists;
  }
  return lastReward;
};

// Fill in the days from the earliest payout day to `maxDays`.
//
// Takes the last (earliest) payout and fills the missing days from that payout day to `maxDays`.
export const prefillMissingDays = (
  payouts: AnySubscan,
  fromDate: Date,
  maxDays: number
) => {
  const newPayouts = [];
  const payoutStartDay = subDays(startOfDay(fromDate), maxDays);
  const payoutEndDay = !payouts.length
    ? startOfDay(fromDate)
    : startOfDay(fromUnixTime(payouts[payouts.length - 1].block_timestamp));

  const daysToPreFill = daysPassed(payoutStartDay, payoutEndDay);

  if (daysToPreFill > 0) {
    for (let i = 1; i < daysToPreFill; i++) {
      newPayouts.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: getUnixTime(subDays(payoutEndDay, i)),
      });
    }
  }
  return newPayouts;
};

// Fill in the days from the current day to the last payout.
//
// Takes the first payout (most recent) and fills the missing days from current day.
export const postFillMissingDays = (
  payouts: AnySubscan,
  fromDate: Date,
  maxDays: number
) => {
  const newPayouts = [];
  const payoutsEndDay = startOfDay(fromUnixTime(payouts[0].block_timestamp));
  const daysSinceLast = Math.min(
    daysPassed(payoutsEndDay, startOfDay(fromDate)),
    maxDays
  );

  for (let i = daysSinceLast; i > 0; i--) {
    newPayouts.push({
      amount: 0,
      event_id: 'Reward',
      block_timestamp: getUnixTime(addDays(payoutsEndDay, i)),
    });
  }
  return newPayouts;
};

// Fill gap days within payouts with zero amounts.
export const fillGapDays = (payouts: AnySubscan, fromDate: Date) => {
  const finalPayouts: AnySubscan = [];

  // current day cursor.
  let curDay = fromDate;

  for (const p of payouts) {
    const thisDay = fromUnixTime(p.block_timestamp);
    const gapDays = Math.max(0, daysPassed(thisDay, curDay) - 1);

    if (gapDays > 0) {
      // add any gap days.
      if (gapDays > 0) {
        for (let j = 1; j <= gapDays; j++) {
          finalPayouts.push({
            amount: 0,
            event_id: 'Reward',
            block_timestamp: getUnixTime(subDays(curDay, j)),
          });
        }
      }
    }

    // add the current day.
    finalPayouts.push(p);

    // day cursor is now the new day.
    curDay = thisDay;
  }
  return finalPayouts;
};

// Utiltiy: normalise payout timestamps to start of day.
export const normalisePayouts = (payouts: AnySubscan) =>
  payouts.map((p: AnySubscan) => ({
    ...p,
    block_timestamp: getUnixTime(startOfDay(fromUnixTime(p.block_timestamp))),
  }));

// Utility: days passed since 2 dates.
export const daysPassed = (from: Date, to: Date) =>
  differenceInDays(startOfDay(to), startOfDay(from));

// Utility: extract whether an event id should be a slash or reward, based on the net day amount.
const getEventId = (c: PayoutDayCursor) =>
  c.amount.isLessThan(0) ? 'Slash' : 'Reward';

// Utility: Formats a width and height pair.
export const formatSize = (
  {
    width,
    height,
  }: {
    width: string | number;
    height: number;
  },
  minHeight: number
) => ({
  width: width || '100%',
  height: height || minHeight,
  minHeight,
});
