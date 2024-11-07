// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { TimeLeftFormatted, TimeLeftRaw } from 'hooks/useTimeLeft/types';
import type { TFunction } from 'i18next';

// Return `planckToUnit` as a `BigNumber`.
export const planckToUnitBn = (val: BigNumber, units: number): BigNumber =>
  new BigNumber(planckToUnit(val.toString(), units));

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
