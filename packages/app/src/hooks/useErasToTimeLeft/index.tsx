// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'

export const useErasToTimeLeft = () => {
  const { getConsts } = useApi()
  const { network } = useNetwork()
  const { epochDuration, expectedBlockTime, sessionsPerEra } =
    getConsts(network)

  // Converts a number of eras to timeleft in seconds
  const erasToSeconds = (eras: bigint | number): number => {
    if (eras <= 0) {
      return 0
    }
    // Store the duration of an era in number of blocks
    const eraDurationBlocks = epochDuration * BigInt(sessionsPerEra)
    // estimate the duration of the era in seconds.
    const eraDuration = (eraDurationBlocks * expectedBlockTime) / 1000n
    // Multiply by number of eras
    return Number(eras) * Number(eraDuration)
  }

  return {
    erasToSeconds,
  }
}
