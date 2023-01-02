// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useUi } from 'contexts/UI';
import {
  differenceInDays,
  endOfDay,
  endOfTomorrow,
  fromUnixTime,
  getUnixTime,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns';
import throttle from 'lodash.throttle';
import React from 'react';
import { AnySubscan } from 'types';
import { planckBnToUnit } from 'Utils';

export const getSize = (element: any) => {
  const width = element?.offsetWidth;
  const height = element?.offsetHeight;
  return { height, width };
};

export const useSize = (element: any) => {
  const { containerRefs } = useUi();

  const [size, setSize] = React.useState(getSize(element));

  const throttleCallback = () => {
    setSize(getSize(element));
  };

  React.useEffect(() => {
    const resizeThrottle = throttle(throttleCallback, 100, {
      trailing: true,
      leading: false,
    });

    // listen to main interface resize if ref is available, otherwise
    // fall back to window resize.
    const listenFor = containerRefs?.mainInterface?.current ?? window;
    listenFor.addEventListener('resize', resizeThrottle);
    return () => {
      listenFor.removeEventListener('resize', resizeThrottle);
    };
  });
  return size;
};

interface FormatSizeIf {
  width: string | number;
  height: number;
}

export const formatSize = (
  { width, height }: FormatSizeIf,
  minHeight: number
) => ({
  width: width || '100%',
  height: height || minHeight,
  minHeight,
});

interface GetGradientIf {
  right: number;
  left: number;
  top: number;
  bottom: number;
}

export const getGradient = (
  ctx: any,
  { right, left, top, bottom }: GetGradientIf
) => {
  let width;
  let height;
  let gradient;

  const chartWidth = right - left;
  const chartHeight = bottom - top;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, bottom, 0, top);
    gradient.addColorStop(0, 'rgba(203, 37, 111, 0.9)');
    gradient.addColorStop(1, 'rgba(223, 81, 144, 0.7)');
  }
  return gradient;
};

// given payouts, calculate daily income and fill missing days with zero amounts.
export const calculatePayoutsByDay = (
  payouts: any,
  maxDays: number,
  units: number,
  // eslint-disable-next-line
  subject: string
) => {
  if (!payouts.length) return payouts;

  let payoutsByDay: any = [];

  // prefill missing days from last payout leading to current day.
  payoutsByDay = postFillMissingDays(payouts, maxDays);

  // start processing payouts, if any.
  if (payouts.length > 0) {
    // payouts passed
    let p = 0;
    // current day cursor.
    let curDay = new Date();
    // current payout cursor.
    let curPayout = {
      amount: new BN(0),
      event_id: '',
    };

    // start iterating payouts, most recent first.
    for (const payout of payouts) {
      p++;

      // extract day from current payout.
      const thisDay = startOfDay(fromUnixTime(payout.block_timestamp));

      // initialise current day if first payout.
      if (p === 1) {
        curDay = thisDay;
      }

      // handle surpassed maximum days.
      const daysSince = differenceInDays(startOfDay(new Date()), thisDay);
      if (daysSince > maxDays) {
        break;
      }

      // get difference between day cursor and payout day.
      const daysDiff = differenceInDays(curDay, thisDay);

      // handle new day.
      if (daysDiff > 0) {
        const gapDays = daysDiff - 1;

        // process outstanding gap days.
        if (gapDays > 0) {
          for (let j = 1; j <= gapDays; j++) {
            payoutsByDay.push({
              amount: 0,
              event_id: 'Reward',
              block_timestamp: getUnixTime(subDays(curDay, j)),
            });
          }
        }

        // add current payout cursor to payoutsByDay.
        payoutsByDay.push({
          amount: planckBnToUnit(curPayout.amount, units),
          event_id: curPayout.amount.lt(new BN(0)) ? 'Slash' : 'Reward',
          block_timestamp: getUnixTime(curDay),
        });

        // update date cursor to the new day.
        curDay = thisDay;
        // update current payout cursor for the new day.
        curPayout = {
          amount: new BN(payout.amount),
          event_id: new BN(payout.amount).lt(new BN(0)) ? 'Slash' : 'Reward',
        };
      } else {
        // in same day. Aadd payout amount to current payout cursor.
        curPayout.amount = curPayout.amount.add(new BN(payout.amount));
      }
    }
  }
  return payoutsByDay;
};

// calculate average payouts per day.
export const calculatePayoutAverages = (
  payoutsByDay: AnySubscan,
  average: number,
  days: number
) => {
  // if we don't need to take an average, just return the `payoutsByDay`.
  if (average <= 1) return payoutsByDay;

  // create moving average value over `average` days.
  const averagePayoutsByDay = [];
  for (let i = 0; i < payoutsByDay.length; i++) {
    // period end.
    const end = Math.max(0, i - average);

    // the total amount earned in average period.
    let total = 0;
    // period length to be determined.
    let num = 0;

    for (let j = i; j >= end; j--) {
      const index = i - j;
      if (payoutsByDay[index]) {
        total += payoutsByDay[index].amount;
      }
      // increase by one to treat non-existent as zero value
      num += 1;
    }

    if (total === 0) {
      total = payoutsByDay[i].amount;
    }

    averagePayoutsByDay.push({
      amount: total / num,
      event_id: payoutsByDay[i].event_id,
      block_timestamp: payoutsByDay[i].block_timestamp,
    });
  }

  // return an array with the expected number of items
  return averagePayoutsByDay.slice(0, days - average);
};

// format rewards and return last payment
export const formatRewardsForGraphs = (
  days: number,
  units: number,
  payouts: AnySubscan,
  poolClaims: AnySubscan
) => {
  const payoutsByDay = prefillMissingDays(
    calculatePayoutsByDay(payouts, days, units, 'staking'),
    days
  );
  const poolClaimsByDay = prefillMissingDays(
    calculatePayoutsByDay(poolClaims, days, units, 'pools'),
    days
  );

  return {
    // reverse rewards: most recent last
    payoutsByDay,
    poolClaimsByDay,
    lastReward: getLatestReward(payouts, poolClaims),
  };
};

/* combineRewardsByDay
 * combines payouts and pool claims into daily records.
 * removes the `event_id` field from records.
 */
export const combineRewardsByDay = (
  payoutsByDay: AnySubscan,
  poolClaimsByDay: AnySubscan
) => {
  // we first check if actual payouts exist, e.g. there are non-zero payout
  // amounts present in either payouts or pool claims.
  const poolClaimExists =
    poolClaimsByDay.find((p: AnySubscan) => p.amount > 0) || null;
  const payoutExists =
    payoutsByDay.find((p: AnySubscan) => p.amount > 0) || null;

  // if no pool claims exist but payouts do, return payouts w.o. event_id
  // also do this if there are no payouts period.
  if (
    (!poolClaimExists && payoutExists) ||
    (!payoutExists && !poolClaimExists)
  ) {
    return payoutsByDay.map((p: AnySubscan) => ({
      amount: p.amount,
      block_timestamp: p.block_timestamp,
    }));
  }

  // if no payouts exist but pool claims do, return pool claims w.o. event_id
  if (!payoutExists && poolClaimExists) {
    return poolClaimsByDay.map((p: AnySubscan) => ({
      amount: p.amount,
      block_timestamp: p.block_timestamp,
    }));
  }

  // We now know pool claims *and* payouts exist.
  //
  // Now determine which dates to display.
  let payoutDays: Array<any> = [];
  // prefill `dates` with all pool claim and payout days
  poolClaimsByDay.forEach((p: AnySubscan) => {
    const dayStart = getUnixTime(startOfDay(fromUnixTime(p.block_timestamp)));
    if (!payoutDays.includes(dayStart)) {
      payoutDays.push(dayStart);
    }
  });
  payoutsByDay.forEach((p: AnySubscan) => {
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
    const payoutsThisDay = payoutsByDay.filter((p: AnySubscan) =>
      isSameDay(fromUnixTime(p.block_timestamp), fromUnixTime(d))
    );
    // check pool claims exist on this day
    const poolClaimsThisDay = poolClaimsByDay.filter((p: AnySubscan) =>
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

/* getLastReward
 * gets the latest reward from pool claims and nominator payouts..
 */
export const getLatestReward = (
  payouts: AnySubscan,
  poolClaims: AnySubscan
) => {
  // get most recent payout
  const payoutExists =
    payouts.find((p: AnySubscan) => new BN(p.amount).gt(new BN(0))) ?? null;
  const poolClaimExists =
    poolClaims.find((p: AnySubscan) => new BN(p.amount).gt(new BN(0))) ?? null;

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

// fill in the backlog of days up to `maxDays`
export const prefillMissingDays = (payoutsByDay: any, maxDays: number) => {
  // the earliest day to be displayed.
  const lastDay = subDays(startOfDay(new Date()), maxDays);

  // the last payout.
  const lastPayoutDate = !payoutsByDay.length
    ? startOfDay(new Date())
    : fromUnixTime(payoutsByDay[payoutsByDay.length - 1].block_timestamp);

  const diffDays = differenceInDays(lastPayoutDate, lastDay);

  if (diffDays > 0) {
    let thisDay = lastPayoutDate;

    for (let i = 0; i < diffDays; i++) {
      thisDay = subDays(thisDay, 1);
      payoutsByDay.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: getUnixTime(thisDay),
      });
    }
  }
  return payoutsByDay;
};

// fill in the days from the last payout to the current day
const postFillMissingDays = (payouts: any, maxDays: number) => {
  const missingDays = [];

  // determine inactive days since last payout
  const lastTs = endOfDay(fromUnixTime(payouts[0].block_timestamp));

  // amount of days since the last payout, from end of current day.
  let daysSinceLast = differenceInDays(endOfTomorrow(), lastTs);

  // pad the days since the last payout to the current date.
  if (daysSinceLast > 0) {
    daysSinceLast = daysSinceLast > maxDays ? maxDays : daysSinceLast;

    for (let i = 0; i < daysSinceLast; i++) {
      missingDays.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: getUnixTime(subDays(lastTs, i)),
      });
    }
  }

  return missingDays;
};
