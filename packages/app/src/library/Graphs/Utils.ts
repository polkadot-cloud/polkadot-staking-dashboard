// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import BigNumber from 'bignumber.js'
import type { AnyApi } from 'common-types'
import { MaxPayoutDays } from 'consts'
import type { PayoutsAndClaims } from 'controllers/Subscan/types'
import type { Locale } from 'date-fns'
import {
  addDays,
  differenceInDays,
  format,
  fromUnixTime,
  getUnixTime,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns'
import type { NominatorReward } from 'plugin-staking-api/types'
import { planckToUnitBn } from 'utils'
import type { PayoutDayCursor } from './types'

// Given payouts, calculate daily income and fill missing days with zero rewards
export const calculateDailyPayouts = (
  payouts: AnyApi,
  fromDate: Date,
  maxDays: number,
  units: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subject: string
) => {
  let dailyPayouts: AnyApi = []

  // remove days that are beyond end day limit
  payouts = payouts.filter(
    (p: AnyApi) => daysPassed(fromUnixTime(p.timestamp), fromDate) <= maxDays
  )

  // return now if no payouts.
  if (!payouts.length) {
    return payouts
  }

  // post-fill any missing days. [current day -> last payout]
  dailyPayouts = postFillMissingDays(payouts, fromDate, maxDays)

  // start iterating payouts, most recent first
  //
  // payouts passed
  let p = 0
  // current day cursor
  let curDay: Date = fromDate
  // current payout cursor
  let curPayout: PayoutDayCursor = {
    reward: new BigNumber(0),
  }
  for (const payout of payouts) {
    p++

    // extract day from current payout
    const thisDay = startOfDay(fromUnixTime(payout.timestamp))

    // initialise current day if first payout
    if (p === 1) {
      curDay = thisDay
    }

    // handle surpassed maximum days
    if (daysPassed(thisDay, fromDate) >= maxDays) {
      dailyPayouts.push({
        reward: planckToUnitBn(curPayout.reward, units),
        timestamp: getUnixTime(curDay),
      })
      break
    }

    // get day difference between cursor and current payout
    const daysDiff = daysPassed(thisDay, curDay)

    // handle new day.
    if (daysDiff > 0) {
      // add current payout cursor to dailyPayouts
      dailyPayouts.push({
        reward: planckToUnitBn(curPayout.reward, units),
        timestamp: getUnixTime(curDay),
      })

      // update day cursor to the new day
      curDay = thisDay
      // reset current payout cursor for the new day
      curPayout = {
        reward: new BigNumber(payout.reward),
      }
    } else {
      // in same day. Aadd payout reward to current payout cursor
      curPayout.reward = curPayout.reward.plus(payout.reward)
    }

    // if only 1 payout exists, or at the last unresolved payout, exit here
    if (
      payouts.length === 1 ||
      (p === payouts.length && !curPayout.reward.isZero())
    ) {
      dailyPayouts.push({
        reward: planckToUnitBn(curPayout.reward, units),
        timestamp: getUnixTime(curDay),
      })
      break
    }
  }

  // return payout rewards as plain numbers
  return dailyPayouts.map((q: AnyApi) => ({
    ...q,
    reward: Number(q.reward.toString()),
  }))
}

// Calculate average payouts per day
export const calculatePayoutAverages = (
  payouts: AnyApi,
  fromDate: Date,
  days: number,
  avgDays: number
) => {
  // if we don't need to take an average, just return `payouts`
  if (avgDays <= 1) {
    return payouts
  }

  // create moving average value over `avgDays` past days, if any
  let payoutsAverages: { reward: number; timestamp: number }[] = []
  for (let i = 0; i < payouts.length; i++) {
    // average period end.
    const end = Math.max(0, i - avgDays)

    // the total reward earned in period
    let total = 0
    // period length to be determined
    let num = 0

    for (let j = i; j >= end; j--) {
      if (payouts[j]) {
        total += payouts[j].reward
      }
      // increase by one to treat non-existent as zero value
      num += 1
    }

    if (total === 0) {
      total = payouts[i].reward
    }

    // If on last reward and is a zero (current era still processing), use previous reward to
    // prevent misleading dip
    const reward =
      i === payouts.length - 1 && payouts[i].reward === 0
        ? payoutsAverages[i - 1].reward
        : total / num

    payoutsAverages.push({
      reward,
      timestamp: payouts[i].timestamp,
    })
  }

  // return an array with the expected number of items
  payoutsAverages = payoutsAverages.filter(
    (p: AnyApi) => daysPassed(fromUnixTime(p.timestamp), fromDate) <= days
  )

  return payoutsAverages
}

// Fetch rewards and graph meta data
//
// Format provided payouts and returns the last payment
export const formatRewardsForGraphs = (
  fromDate: Date,
  days: number,
  units: number,
  payouts: NominatorReward[],
  poolClaims: AnyApi,
  unclaimedPayouts: NominatorReward[]
) => {
  // process nominator payouts
  const allPayouts = processPayouts(payouts, fromDate, days, units, 'nominate')

  // process unclaimed nominator payouts.
  const allUnclaimedPayouts = processPayouts(
    unclaimedPayouts,
    fromDate,
    days,
    units,
    'nominate'
  )

  // process pool claims
  const allPoolClaims = processPayouts(
    poolClaims,
    fromDate,
    days,
    units,
    'pools'
  )

  return {
    // reverse rewards: most recent last
    allPayouts,
    allUnclaimedPayouts,
    allPoolClaims,
    lastReward: getLatestReward(payouts, poolClaims),
  }
}
// Process payouts
//
// calls the relevant functions on raw payouts to format them correctly
const processPayouts = (
  payouts: AnyApi,
  fromDate: Date,
  days: number,
  units: number,
  subject: string
) => {
  // normalise payout timestamps.
  const normalised = normalisePayouts(payouts)
  // calculate payouts per day from the current day
  let p = calculateDailyPayouts(normalised, fromDate, days, units, subject)
  // pre-fill payouts if max days have not been reached
  p = p.concat(prefillMissingDays(p, fromDate, days))
  // fill in gap days between payouts with zero values
  p = fillGapDays(p, fromDate)
  // reverse payouts: most recent last
  p = p.reverse()

  // use normalised payouts for calculating the 10-day average prior to the start of the payout graph
  const avgDays = 10
  const preNormalised = getPreMaxDaysPayouts(
    normalised,
    fromDate,
    days,
    avgDays
  )
  // start of average calculation should be the earliest date
  const averageFromDate = subDays(fromDate, MaxPayoutDays)

  let a = calculateDailyPayouts(
    preNormalised,
    averageFromDate,
    avgDays,
    units,
    subject
  )
  // prefill payouts if we are missing the earlier dates
  a = a.concat(prefillMissingDays(a, averageFromDate, avgDays))
  // fill in gap days between payouts with zero values
  a = fillGapDays(a, averageFromDate)
  // reverse payouts: most recent last
  a = a.reverse()

  return { p, a }
}

// Get payout average in `avgDays` day period after to `days` threshold
//
// These payouts are used for calculating the `avgDays`-day average prior to the start of the payout
// graph
const getPreMaxDaysPayouts = (
  payouts: AnyApi,
  fromDate: Date,
  days: number,
  avgDays: number
) =>
  // remove payouts that are not within `avgDays` `days` pre-graph window
  payouts.filter(
    (p: AnyApi) =>
      daysPassed(fromUnixTime(p.timestamp), fromDate) > days &&
      daysPassed(fromUnixTime(p.timestamp), fromDate) <= days + avgDays
  )
// Combine payouts and pool claims.
//
// combines payouts and pool claims into daily records
export const combineRewards = (payouts: AnyApi, poolClaims: AnyApi) => {
  // we first check if actual payouts exist, e.g. there are non-zero payout rewards present in
  // either payouts or pool claims.
  const poolClaimExists = poolClaims.find((p: AnyApi) => p.reward > 0) || null
  const payoutExists = payouts.find((p: AnyApi) => p.reward > 0) || null

  // if no pool claims exist but payouts do, return payouts. Also do this if there are no payouts
  // period
  if (
    (!poolClaimExists && payoutExists) ||
    (!payoutExists && !poolClaimExists)
  ) {
    return payouts.map((p: AnyApi) => ({
      reward: p.reward,
      timestamp: p.timestamp,
    }))
  }

  // if no payouts exist but pool claims do, return pool claims
  if (!payoutExists && poolClaimExists) {
    return poolClaims.map((p: AnyApi) => ({
      reward: p.reward,
      timestamp: p.timestamp,
    }))
  }

  // We now know pool claims *and* payouts exist
  //
  // Now determine which dates to display
  let payoutDays: AnyJson[] = []
  // prefill `dates` with all pool claim and payout days
  poolClaims.forEach((p: AnyApi) => {
    const dayStart = getUnixTime(startOfDay(fromUnixTime(p.timestamp)))
    if (!payoutDays.includes(dayStart)) {
      payoutDays.push(dayStart)
    }
  })
  payouts.forEach((p: AnyApi) => {
    const dayStart = getUnixTime(startOfDay(fromUnixTime(p.timestamp)))
    if (!payoutDays.includes(dayStart)) {
      payoutDays.push(dayStart)
    }
  })

  // sort payoutDays by `timestamp`
  payoutDays = payoutDays.sort((a: AnyApi, b: AnyApi) => a - b)

  // Iterate payout days.
  //
  // Combine payouts into one unified `rewards` array
  const rewards: AnyApi = []

  // loop pool claims and consume / combine payouts
  payoutDays.forEach((d: AnyApi) => {
    let reward = 0

    // check payouts exist on this day
    const payoutsThisDay = payouts.filter((p: AnyApi) =>
      isSameDay(fromUnixTime(p.timestamp), fromUnixTime(d))
    )
    // check pool claims exist on this day
    const poolClaimsThisDay = poolClaims.filter((p: AnyApi) =>
      isSameDay(fromUnixTime(p.timestamp), fromUnixTime(d))
    )
    // add rewards
    if (payoutsThisDay.concat(poolClaimsThisDay).length) {
      for (const payout of payoutsThisDay) {
        reward += payout.reward
      }
    }
    rewards.push({
      reward,
      timestamp: d,
    })
  })
  return rewards
}

// Get latest reward.
//
// Gets the latest reward from pool claims and nominator payouts
export const getLatestReward = (payouts: AnyApi, poolClaims: AnyApi) => {
  // get most recent payout
  const payoutExists =
    payouts.find((p: AnyApi) => new BigNumber(p.reward).isGreaterThan(0)) ??
    null
  const poolClaimExists =
    poolClaims.find((p: AnyApi) => new BigNumber(p.reward).isGreaterThan(0)) ??
    null

  // calculate which payout was most recent
  let lastReward = null
  if (!payoutExists || !poolClaimExists) {
    if (payoutExists) {
      lastReward = payoutExists
    }
    if (poolClaimExists) {
      lastReward = poolClaimExists
    }
  } else {
    // both `payoutExists` and `poolClaimExists` are present
    lastReward =
      payoutExists.timestamp > poolClaimExists.timestamp
        ? payoutExists
        : poolClaimExists
  }
  return lastReward
}

// Fill in the days from the earliest payout day to `maxDays`
//
// Takes the last (earliest) payout and fills the missing days from that payout day to `maxDays`
export const prefillMissingDays = (
  payouts: AnyApi,
  fromDate: Date,
  maxDays: number
) => {
  const newPayouts = []
  const payoutStartDay = subDays(startOfDay(fromDate), maxDays)
  const payoutEndDay = !payouts.length
    ? startOfDay(fromDate)
    : startOfDay(fromUnixTime(payouts[payouts.length - 1].timestamp))

  const daysToPreFill = daysPassed(payoutStartDay, payoutEndDay)

  if (daysToPreFill > 0) {
    for (let i = 1; i < daysToPreFill; i++) {
      newPayouts.push({
        reward: 0,
        timestamp: getUnixTime(subDays(payoutEndDay, i)),
      })
    }
  }
  return newPayouts
}

// Fill in the days from the current day to the last payout
//
// Takes the first payout (most recent) and fills the missing days from current day
export const postFillMissingDays = (
  payouts: AnyApi,
  fromDate: Date,
  maxDays: number
) => {
  const newPayouts = []
  const payoutsEndDay = startOfDay(fromUnixTime(payouts[0].timestamp))
  const daysSinceLast = Math.min(
    daysPassed(payoutsEndDay, startOfDay(fromDate)),
    maxDays
  )

  for (let i = daysSinceLast; i > 0; i--) {
    newPayouts.push({
      reward: 0,
      timestamp: getUnixTime(addDays(payoutsEndDay, i)),
    })
  }
  return newPayouts
}

// Fill gap days within payouts with zero rewards
export const fillGapDays = (payouts: AnyApi, fromDate: Date) => {
  const finalPayouts: AnyApi = []

  // current day cursor
  let curDay = fromDate

  for (const p of payouts) {
    const thisDay = fromUnixTime(p.timestamp)
    const gapDays = Math.max(0, daysPassed(thisDay, curDay) - 1)

    if (gapDays > 0) {
      // add any gap days
      if (gapDays > 0) {
        for (let j = 1; j <= gapDays; j++) {
          finalPayouts.push({
            reward: 0,
            timestamp: getUnixTime(subDays(curDay, j)),
          })
        }
      }
    }

    // add the current day
    finalPayouts.push(p)

    // day cursor is now the new day
    curDay = thisDay
  }
  return finalPayouts
}

// Utiltiy: normalise payout timestamps to start of day
export const normalisePayouts = (payouts: AnyApi) =>
  payouts.map((p: AnyApi) => ({
    ...p,
    timestamp: getUnixTime(startOfDay(fromUnixTime(p.timestamp))),
  }))

// Utility: days passed since 2 dates
export const daysPassed = (from: Date, to: Date) =>
  differenceInDays(startOfDay(to), startOfDay(from))

// Utility: Formats a width and height pair
export const formatSize = (
  {
    width,
    height,
  }: {
    width: string | number
    height: number
  },
  minHeight: number
) => ({
  width: width || '100%',
  height: height || minHeight,
  minHeight,
})

// Take non-zero rewards in most-recent order
export const removeNonZeroAmountAndSort = (payouts: PayoutsAndClaims) => {
  const list = payouts
    .filter((p) => Number(p.reward) > 0)
    .sort((a, b) => b.timestamp - a.timestamp)

  // Calculates from the current date.
  const fromTimestamp = getUnixTime(subDays(new Date(), MaxPayoutDays))
  // Ensure payouts not older than `MaxPayoutDays` are returned.
  return list.filter(({ timestamp }) => timestamp >= fromTimestamp)
}

// Calculate the earliest date of a payout list
export const getPayoutsFromDate = (
  payouts: PayoutsAndClaims,
  locale: Locale
) => {
  if (!payouts.length) {
    return undefined
  }
  const filtered = removeNonZeroAmountAndSort(payouts)
  if (!filtered.length) {
    return undefined
  }
  return format(
    fromUnixTime(filtered[filtered.length - 1].timestamp),
    'do MMM',
    {
      locale,
    }
  )
}

// Calculate the latest date of a payout list
export const getPayoutsToDate = (payouts: PayoutsAndClaims, locale: Locale) => {
  if (!payouts.length) {
    return undefined
  }
  const filtered = removeNonZeroAmountAndSort(payouts || [])
  if (!filtered.length) {
    return undefined
  }
  return format(fromUnixTime(filtered[0].timestamp), 'do MMM', {
    locale,
  })
}
