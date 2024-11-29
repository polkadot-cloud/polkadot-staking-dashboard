// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getDurationFromNow } from '@w3ux/hooks/util';
import type { TimeLeftFormatted, TimeLeftRaw } from '@w3ux/types';
import { planckToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import type { TFunction } from 'i18next';

// Return `planckToUnit` as a `BigNumber`.
export const planckToUnitBn = (val: BigNumber, units: number): BigNumber =>
  new BigNumber(planckToUnit(val.toFormat({ groupSeparator: '' }), units));

// Converts a string to a BigNumber.
export const stringToBn = (value: string): BigNumber =>
  new BigNumber(rmCommas(value));

// Formats a given time breakdown (days, hours, minutes, seconds) into a readable structure using a
// translation function. Falls back to displaying seconds if both days and hours are absent.
export const formatTimeleft = (
  t: TFunction,
  { days, hours, minutes, seconds }: TimeLeftRaw
): TimeLeftFormatted => {
  // Create a default object containing formatted time components for days, hours, and minutes
  const formatted: TimeLeftFormatted = {
    days: [days, t('time.day', { count: days, ns: 'base' })],
    hours: [hours, t('time.hr', { count: hours, ns: 'base' })],
    minutes: [minutes, t('time.min', { count: minutes, ns: 'base' })],
  };

  // If there are no days or hours but there are seconds, override with a formatted seconds object
  if (!days && !hours && seconds) {
    formatted['seconds'] = [
      seconds,
      t('time.second', { count: seconds, ns: 'base' }),
    ];
    return formatted;
  }
  return formatted;
};

// format the duration (from seconds) as a string.
export const timeleftAsString = (
  t: TFunction,
  start: number,
  duration: number,
  full?: boolean
) => {
  const { days, hours, minutes, seconds } = getDurationFromNow(
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

// Convert a perbill BigNumber value into a percentage.
export const perbillToPercent = (
  value: BigNumber | bigint | number
): BigNumber => {
  if (typeof value === 'bigint' || typeof value === 'number') {
    value = new BigNumber(value.toString());
  }
  return value.dividedBy('10000000');
};
