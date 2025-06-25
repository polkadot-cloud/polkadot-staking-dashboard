// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
    const start = activeEra.start / 1000n

    // Store the duration of an era in block numbers
    const eraDurationBlocks = epochDuration * BigInt(sessionsPerEra)

    // Estimate the duration of the era in seconds
    const eraDuration = Number((eraDurationBlocks * expectedBlockTime) / 1000n)

    // Estimate the end time of the era
    const end = Number(start) + eraDuration

    // Estimate remaining time of era
    const timeleft = Math.max(0, end - getUnixTime(new Date()))

    // Percentage of eraDuration
    const percentage = eraDuration / 100
    const percentRemaining = timeleft === 0 ? 100 : timeleft / percentage
    const percentSurpassed = timeleft === 0 ? 0 : 100 - percentRemaining

    return { timeleft, end, percentSurpassed, percentRemaining }
  }

  return { get }
}
