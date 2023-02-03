// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getUnixTime, intervalToDuration } from 'date-fns';
import { TFunction } from 'i18next';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { defaultDuration } from './defaults';
import { TimeleftDuration } from './types';

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

  const months = d?.months || 0;
  const days = d?.days || 0;
  const hours = d?.hours || 0;
  const minutes = d?.minutes || 0;
  const seconds = d?.seconds || 0;
  const lastHour = months === 0 && days === 0 && hours === 0;
  const lastMinute = lastHour && minutes === 0;

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    lastMinute,
  };
};

// format the duration as a string.
export const timeleftAsString = (
  t: TFunction,
  toDate?: Date,
  full?: boolean
) => {
  const { months, days, hours, minutes, seconds } = getDuration(toDate || null);

  const tHour = `time.${full ? `hour` : `hr`}`;
  const tMinute = `time.${full ? `minute` : `min`}`;

  let str = '';
  if (months > 0) {
    str += `${months} ${t('time.month', { count: months, ns: 'base' })}`;
  }
  if (days > 0) {
    str += `${days} ${t('time.day', { count: days, ns: 'base' })}`;
  }
  if (hours > 0) {
    str += ` ${hours} ${t(tHour, { count: hours, ns: 'base' })}`;
  }
  if (minutes > 0) {
    str += ` ${minutes} ${t(tMinute, { count: minutes, ns: 'base' })}`;
  }
  if (!months && !days && !hours) {
    str += ` ${seconds}`;
  }
  return str;
};

export const eraDurationFormatted = (bondDuration: number, t: TFunction) => {
  const { erasToSeconds } = useErasToTimeLeft();
  const durationSeconds = erasToSeconds(bondDuration);
  return timeleftAsString(t, fromNow(durationSeconds), true);
};
