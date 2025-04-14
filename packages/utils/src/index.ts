// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getDurationFromNow } from '@w3ux/hooks/util'
import type { TimeLeftFormatted, TimeLeftRaw } from '@w3ux/types'
import { planckToUnit, rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { fromUnixTime, getUnixTime } from 'date-fns'
import type { TFunction } from 'i18next'

// Return `planckToUnit` as a `BigNumber`.
export const planckToUnitBn = (val: BigNumber, units: number): BigNumber =>
  new BigNumber(planckToUnit(val.toFormat({ groupSeparator: '' }), units))

// Converts a string to a BigNumber.
export const stringToBn = (value: string): BigNumber =>
  new BigNumber(rmCommas(value))

// Formats a given time breakdown (days, hours, minutes, seconds) into a readable structure using a
// translation function. Falls back to displaying seconds if both days and hours are absent.
export const formatTimeleft = (
  t: TFunction,
  { days, hours, minutes, seconds }: TimeLeftRaw
): TimeLeftFormatted => {
  // Create a default object containing formatted time components for days, hours, and minutes
  const formatted: TimeLeftFormatted = {
    days: [days, t('time.day', { count: days, ns: 'app' })],
    hours: [hours, t('time.hr', { count: hours, ns: 'app' })],
    minutes: [minutes, t('time.min', { count: minutes, ns: 'app' })],
  }

  // If there are no days or hours but there are seconds, override with a formatted seconds object
  if (!days && !hours && seconds) {
    formatted['seconds'] = [
      seconds,
      t('time.second', { count: seconds, ns: 'app' }),
    ]
    return formatted
  }
  return formatted
}

// format the duration (from seconds) as a string.
export const timeleftAsString = (
  t: TFunction,
  start: number,
  duration: number,
  full?: boolean
) => {
  const { days, hours, minutes, seconds } = getDurationFromNow(
    fromUnixTime(start + duration) || null
  )

  const tHour = `time.${full ? `hour` : `hr`}`
  const tMinute = `time.${full ? `minute` : `min`}`

  let str = ''
  if (days > 0) {
    str += `${days} ${t('time.day', { count: days, ns: 'app' })}`
  }
  if (hours > 0) {
    if (str) {
      str += ', '
    }
    str += ` ${hours} ${t(tHour, { count: hours, ns: 'app' })}`
  }
  if (minutes > 0) {
    if (str) {
      str += ', '
    }
    str += ` ${minutes} ${t(tMinute, { count: minutes, ns: 'app' })}`
  }
  if (!days && !hours) {
    if (str) {
      str += ', '
    }
    str += ` ${seconds}`
  }
  return str
}

// Convert a perbill BigNumber value into a percentage.
export const perbillToPercent = (
  value: BigNumber | bigint | number
): BigNumber => {
  if (typeof value === 'bigint' || typeof value === 'number') {
    value = new BigNumber(value)
  }
  return value.dividedBy('10000000')
}

export const registerLastVisited = (utmSource: string | null) => {
  const attributes = utmSource ? { utmSource } : {}

  if (!localStorage.getItem('last_visited')) {
    registerSaEvent('new_user', attributes)
  } else {
    registerSaEvent('returning_user', attributes)
  }
  localStorage.setItem('last_visited', String(getUnixTime(Date.now())))
}

export const registerSaEvent = (e: string, a: unknown = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.sa_event) {
    w.sa_event(e, a)
  }
}
