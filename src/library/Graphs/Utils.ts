// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useUi } from 'contexts/UI';
import throttle from 'lodash.throttle';
import moment from 'moment';
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
  average: number,
  units: number
) => {
  if (!payouts.length) return payouts;

  // if we are taking an average, we will need extra days of data.
  if (average > 1) maxDays += average;

  const payoutsByDay: any = [];
  let curDay = 367;
  let curYear = 3000;
  let curPayout = {
    amount: new BN(0),
    event_id: '',
  };

  // determine inactive days since last payout
  const lastTs = moment.unix(payouts[0].block_timestamp);

  // test from start of day as to not duplicate today's payout entry
  let daysSinceLast = moment().startOf('day').diff(lastTs, 'days');

  // add inactive days
  if (daysSinceLast > 0) {
    daysSinceLast = daysSinceLast > maxDays ? maxDays : daysSinceLast;
    let timestamp = moment().add(1, 'days').endOf('day');
    for (let i = 1; i <= daysSinceLast; i++) {
      timestamp = timestamp.subtract(1, 'days');
      payoutsByDay.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: timestamp.unix(),
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

      // extract day and year from payout timestamp
      const date = moment.unix(payout.block_timestamp);
      const _day = date.dayOfYear();
      const _year = date.year();

      // starting a new day
      if (_day < curDay || _year < curYear) {
        // check current day with previous, determine missing days
        const prevTs = moment(`${curDay}/${curYear}`, 'DDD/YYYY').unix();
        const thisTs = moment(`${_day}/${_year}`, 'DDD/YYYY').unix();
        const gapDays = moment.unix(prevTs).diff(moment.unix(thisTs), 'days');

        // increment by `gap `days
        if (i !== 0) {
          i += gapDays;
        } else {
          // increment 1st day
          i++;
        }

        // get timestamp of end of day
        const dayTs = moment(`${curDay}/${curYear}`, 'DDD/YYYY')
          .endOf('day')
          .unix();

        // commit previous day payout
        if (i > 1) {
          payoutsByDay.push({
            amount: planckBnToUnit(curPayout.amount, units),
            event_id: curPayout.amount.lt(new BN(0)) ? 'Slash' : 'Reward',
            block_timestamp: dayTs,
          });
        }

        // commit gap day payouts
        if (i !== 0) {
          // fill missing days
          let gapDayTs = moment.unix(prevTs);
          if (gapDays > 1) {
            for (let j = 1; j < gapDays; j++) {
              gapDayTs = gapDayTs.subtract(1, 'days');
              payoutsByDay.push({
                amount: 0,
                event_id: 'Reward',
                block_timestamp: gapDayTs.unix(),
              });
            }
          }
        }

        // overwrite curPayout for this day
        const amount = new BN(payout.amount);
        curPayout = {
          amount,
          event_id: amount.lt(new BN(0)) ? 'Slash' : 'Reward',
        };

        // update day and year cursors
        if (_day < curDay) curDay = _day;
        if (_year < curYear) curYear = _year;
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
      // increase by one anyway to treat non-existent as zero value
      num += 1;
    }

    averagePayoutsByDay.push({
      amount: total / num,
      event_id: payoutsByDay[i].event_id,
      block_timestamp: payoutsByDay[i].block_timestamp,
    });
  }

  // return an array with the expected number of items
  return averagePayoutsByDay.slice(0, maxDays - average);
};

// fill in the backlog of days up to `maxDays`
export const prefillToMaxDays = (payoutsByDay: any, maxDays: number) => {
  if (payoutsByDay.length < maxDays) {
    const remainingDays = maxDays - payoutsByDay.length;

    // get earliest timestamp
    let timestamp;
    if (!payoutsByDay.length) {
      timestamp = moment().endOf('day');
    } else {
      timestamp = moment.unix(
        payoutsByDay[payoutsByDay.length - 1].block_timestamp
      );
    }

    // fill in remaining days
    for (let i = 0; i < remainingDays; i++) {
      timestamp = timestamp.subtract(1, 'days');
      payoutsByDay.push({
        amount: 0,
        event_id: 'Reward',
        block_timestamp: timestamp.unix(),
      });
    }
  }
  return payoutsByDay;
};

// format rewards and return last payment
export const formatRewardsForGraphs = (
  days: number,
  average: number,
  units: number,
  payouts: AnySubscan,
  poolClaims: AnySubscan
) => {
  const payoutsByDay = prefillToMaxDays(
    calculatePayoutsByDay(payouts, days, average, units),
    days
  );
  const poolClaimsByDay = prefillToMaxDays(
    calculatePayoutsByDay(poolClaims, days, average, units),
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
    return payoutsByDay.map((p: AnySubscan) => {
      return {
        amount: p.amount,
        block_timestamp: p.block_timestamp,
      };
    });
  }

  // if no payouts exist but pool claims do, return pool claims w.o. event_id
  if (!payoutExists && poolClaimExists) {
    return poolClaimsByDay.map((p: AnySubscan) => {
      return {
        amount: p.amount,
        block_timestamp: p.block_timestamp,
      };
    });
  }

  // We now know pool claims *and* payouts exist. We can begin to combine them
  // into one unified `rewards` array.
  let rewards: AnySubscan = [];

  // loop pool claims and consume / combine payouts
  poolClaimsByDay.forEach((p: AnySubscan) => {
    let { amount } = p;

    // check payouts exist on this day
    const payoutsThisDay = payoutsByDay.filter((q: AnySubscan) => {
      return unixSameDay(q.block_timestamp, p.block_timestamp);
    });

    // add amounts
    if (payoutsThisDay.length) {
      for (const payout of payoutsThisDay) {
        amount += payout.amount;
      }
    }
    // consume used payouts
    payoutsByDay = payoutsByDay.filter((q: AnySubscan) => {
      return !unixSameDay(q.block_timestamp, p.block_timestamp);
    });
    rewards.push({
      amount,
      block_timestamp: p.block_timestamp,
    });
  });

  // add remaining payouts
  if (payoutsByDay.length) {
    rewards = rewards.concat(
      payoutsByDay.forEach((p: AnySubscan) => {
        return {
          amount: p.amount,
          block_timestamp: p.block_timestamp,
        };
      })
    );
  }

  // re-order combined rewards based on block timestamp, oldest first
  rewards = rewards.sort((a: AnySubscan, b: AnySubscan) => {
    const x = new BN(a.block_timestamp);
    const y = new BN(b.block_timestamp);
    return y.add(x);
  });

  return rewards;
};

// calculate whether 2 unix timestamps are on the same day
export const unixSameDay = (p: number, q: number) => {
  const dateQ = moment.unix(q);
  const _dayQ = dateQ.dayOfYear();
  const _yearQ = dateQ.year();

  const dateP = moment.unix(p);
  const _dayP = dateP.dayOfYear();
  const _yearP = dateP.year();

  return _dayQ === _dayP && _yearQ === _yearP;
};
