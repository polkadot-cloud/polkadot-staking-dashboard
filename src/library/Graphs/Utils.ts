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
  units: number
) => {
  if (!payouts.length) return payouts;

  const payoutsByDay: any = [];
  let curDate = new Date();
  let curPayout = {
    amount: new BN(0),
    event_id: '',
  };

  // determine inactive days since last payout
  const lastTs = fromUnixTime(payouts[0].block_timestamp);

  // test from start of day as to not duplicate today's payout entry
  let daysSinceLast = differenceInDays(startOfDay(new Date()), lastTs);

  // add inactive days
  if (daysSinceLast > 0) {
    daysSinceLast = daysSinceLast > maxDays ? maxDays : daysSinceLast;

    let timestamp = endOfTomorrow();

    for (let i = 1; i <= daysSinceLast; i++) {
      timestamp = subDays(timestamp, 1);
      payoutsByDay.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: getUnixTime(timestamp),
      });
    }
  }

  if (payouts.length > 0) {
    let p = 0; // payouts passed
    let i = 0; // days passed

    for (const payout of payouts) {
      // break if graph limit reached
      if (payoutsByDay.length >= maxDays) {
        break;
      }
      // increment payout
      p++;
      // extract date from payout timestamp
      const thisDate = fromUnixTime(payout.block_timestamp);

      // starting a new day
      if (differenceInDays(curDate, thisDate) > 0) {
        const gapDays = differenceInDays(
          startOfDay(curDate),
          startOfDay(thisDate)
        );

        // increment by `gap `days
        i = i !== 0 ? (i += gapDays) : i + 1;

        // add previous day payout
        if (i > 1) {
          payoutsByDay.push({
            amount: planckBnToUnit(curPayout.amount, units),
            event_id: curPayout.amount.lt(new BN(0)) ? 'Slash' : 'Reward',
            block_timestamp: getUnixTime(thisDate),
          });
        }

        // add gap day payouts
        if (i !== 0 && gapDays > 1) {
          for (let j = 1; j < gapDays; j++) {
            payoutsByDay.push({
              amount: 0,
              event_id: 'Reward',
              block_timestamp: getUnixTime(subDays(curDate, j)),
            });
          }
        }

        // overwrite curPayout for this day
        const amount = new BN(payout.amount);
        curPayout = {
          amount,
          event_id: amount.lt(new BN(0)) ? 'Slash' : 'Reward',
        };

        // update date cursor
        curDate = thisDate;
      } else {
        // same day: add to curPayout
        curPayout.amount = curPayout.amount.add(new BN(payout.amount));
      }

      // commit last payout
      if (p === payouts.length)
        payoutsByDay.push({
          amount: planckBnToUnit(curPayout.amount, units),
          event_id: curPayout.amount.lt(new BN(0)) ? 'Slash' : 'Reward',
          block_timestamp: payout.block_timestamp,
        });
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

  // create moving average value over `average` days
  const averagePayoutsByDay = [];
  for (let i = 0; i < payoutsByDay.length; i++) {
    let total = 0;
    let num = 0;
    for (let j = 0; j < average; j++) {
      if (payoutsByDay[i + j]) {
        total += payoutsByDay[i + j].amount;
      }
      // increase by one to treat non-existent as zero value
      num += 1;
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

// fill in the backlog of days up to `maxDays`
export const prefillToMaxDays = (payoutsByDay: any, maxDays: number) => {
  if (payoutsByDay.length < maxDays) {
    const remainingDays = maxDays - payoutsByDay.length;

    // get earliest timestamp
    let timestamp;
    if (!payoutsByDay.length) {
      timestamp = endOfDay(new Date());
    } else {
      timestamp = fromUnixTime(
        payoutsByDay[payoutsByDay.length - 1].block_timestamp
      );
    }

    // fill in remaining days
    for (let i = 0; i < remainingDays; i++) {
      timestamp = subDays(timestamp, 1);
      payoutsByDay.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: getUnixTime(timestamp),
      });
    }
  }
  return payoutsByDay;
};

// format rewards and return last payment
export const formatRewardsForGraphs = (
  days: number,
  units: number,
  payouts: AnySubscan,
  poolClaims: AnySubscan
) => {
  const payoutsByDay = prefillToMaxDays(
    calculatePayoutsByDay(payouts, days, units),
    days
  );

  const poolClaimsByDay = prefillToMaxDays(
    calculatePayoutsByDay(poolClaims, days, units),
    days
  );

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

  return {
    // reverse rewards: most recent last
    payoutsByDay: payoutsByDay.reverse(),
    poolClaimsByDay: poolClaimsByDay.reverse(),
    lastReward,
  };
};

/* combineRewardsByDay
 * combines payouts and pool claims into daily records.
 * removes the `event_id` field from records.
 */
export const combineRewardsByDay = (
  payoutsByDay: AnySubscan,
  poolClaimsByDay: AnySubscan,
  days: number
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
    if (!payoutDays.includes(startOfDay(p.block_timestamp))) {
      payoutDays.push(p.block_timestamp);
    }
  });
  payoutsByDay.forEach((p: AnySubscan) => {
    if (!payoutDays.includes(startOfDay(p.block_timestamp))) {
      payoutDays.push(p.block_timestamp);
    }
  });

  // sort payoutDays by `block_timestamp`;
  payoutDays = payoutDays.sort(
    (a: AnySubscan, b: AnySubscan) => a.block_timestamp - b.block_timestamp
  );
  // slice by max days
  payoutDays = payoutDays.slice(0, days + 1);

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
