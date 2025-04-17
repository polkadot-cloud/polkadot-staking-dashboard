// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'

export const useErasPerDay = () => {
  const { getConsts } = useApi()
  const { network } = useNetwork()
  const { epochDuration, expectedBlockTime, sessionsPerEra, historyDepth } =
    getConsts(network)

  const DAY_MS = new BigNumber(86400000)

  // Calculates how many eras there are in a 24 hour period.
  const getErasPerDay = (): BigNumber => {
    if (
      epochDuration === 0n ||
      sessionsPerEra === 0 ||
      expectedBlockTime === 0n
    ) {
      return new BigNumber(0)
    }

    const blocksPerEra = epochDuration * BigInt(sessionsPerEra)
    const msPerEra = blocksPerEra * expectedBlockTime

    return DAY_MS.dividedBy(msPerEra)
  }

  return {
    erasPerDay: getErasPerDay(),
    maxSupportedDays:
      historyDepth === 0 ? 0 : historyDepth / getErasPerDay().toNumber(),
  }
}
