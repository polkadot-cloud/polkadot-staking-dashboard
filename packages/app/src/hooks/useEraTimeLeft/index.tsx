// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { getUnixTime } from 'date-fns'

export const useEraTimeLeft = () => {
  const { network } = useNetwork()
  const { getConsts, activeEra } = useApi()
  const { epochDuration, expectedBlockTime, sessionsPerEra } =
    getConsts(network)

  // Important to fetch the actual timeleft from when other components ask for it
  const get = () => {
    // Get timestamp of era start and convert to seconds
    const start = activeEra.start.multipliedBy(0.001)

    // Store the duration of an era in block numbers
    const eraDurationBlocks = epochDuration * BigInt(sessionsPerEra)

    // Estimate the duration of the era in seconds
    const eraDuration = (eraDurationBlocks * expectedBlockTime) / 1000n

    // Estimate the end time of the era
    const end = start.plus(eraDuration)

    // Estimate remaining time of era
    const timeleft = BigNumber.max(0, end.minus(getUnixTime(new Date())))

    // Percentage of eraDuration
    const percentage = eraDuration / 100n
    const percentRemaining = timeleft.isZero()
      ? new BigNumber(100)
      : timeleft.dividedBy(percentage)
    const percentSurpassed = timeleft.isZero()
      ? new BigNumber(0)
      : new BigNumber(100).minus(percentRemaining)

    return { timeleft, end, percentSurpassed, percentRemaining }
  }

  return { get }
}
