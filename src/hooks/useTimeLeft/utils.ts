// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  differenceInDays,
  fromUnixTime,
  getUnixTime,
  intervalToDuration,
} from 'date-fns';
import type { AnyFunction } from 'types';
import { defaultDuration } from './defaults';
import type { TimeleftDuration } from './types';

// adds `seconds` to the current time and returns the resulting date.
export const fromNow = (seconds: number): Date => {
  const end = new Date();
  end.setSeconds(end.getSeconds() + seconds);
  return end;
};

// calculates the current timeleft duration.
export const getDuration = (toDate: Date | null): TimeleftDuration => {
  if (!toDate) {
    return defaultDuration;
  }
  if (getUnixTime(toDate) <= getUnixTime(new Date())) {
    return defaultDuration;
  }

  toDate.setSeconds(toDate.getSeconds());
  const d = intervalToDuration({
    start: Date.now(),
    end: toDate,
  });

  const days = differenceInDays(toDate, Date.now());
  const hours = d?.hours || 0;
  const minutes = d?.minutes || 0;
  const seconds = d?.seconds || 0;
  const lastHour = days === 0 && hours === 0;
  const lastMinute = lastHour && minutes === 0;

  return {
    days,
    hours,
    minutes,
    seconds,
    lastMinute,
  };
};

// format the duration (from seconds) as a string.
export const timeleftAsString = (
  t: AnyFunction,
  start: number,
  duration: number,
  full?: boolean
) => {
  const { days, hours, minutes, seconds } = getDuration(
    fromUnixTime(start + duration) || null
  );

  const tHour = `time.${full ? `hour` : `hr`}`;
  const tMinute = `time.${full ? `minute` : `min`}`;

  let str = '';
  if (days > 0) {
    str += `${days} ${t('time.day', { count: days, ns: 'base' })}`;
  }
  if (hours > 0) {
    if (str) {
      str += ', ';
    }
    str += ` ${hours} ${t(tHour, { count: hours, ns: 'base' })}`;
  }
  if (minutes > 0) {
    if (str) {
      str += ', ';
    }
    str += ` ${minutes} ${t(tMinute, { count: minutes, ns: 'base' })}`;
  }
  if (!days && !hours) {
    if (str) {
      str += ', ';
    }
    str += ` ${seconds}`;
  }
  return str;
};
