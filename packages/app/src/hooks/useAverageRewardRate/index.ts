// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useErasPerDay } from '../useErasPerDay'
import type { UseAverageRewardRate } from './types'

export const useAverageRewardRate = (): UseAverageRewardRate => {
  const {
    stakingMetrics: { totalIssuance },
  } = useApi()
  const { network } = useNetwork()
  const { erasPerDay } = useErasPerDay()
  const { pluginEnabled } = usePlugins()
  const { lastTotalStake } = useApi().stakingMetrics
  const { avgCommission, averageEraValidatorReward, avgRewardRate } =
    useValidators()

  const { units } = getStakingChainData(network)

  // Get average reward rate based on the current staking metrics. Directly returns rate from
  // staking API if available
  const getAverageRewardRate = (compounded: boolean = false): number => {
    if (pluginEnabled('staking_api')) {
      return avgRewardRate
    }

    if (
      totalIssuance === 0n ||
      erasPerDay === 0 ||
      avgCommission === 0 ||
      averageEraValidatorReward.reward === 0n
    ) {
      return 0
    }

    // Total supply as percent
    const totalIssuanceUnit = Number(planckToUnit(totalIssuance, units))
    const lastTotalStakeUnit = Number(planckToUnit(lastTotalStake, units))
    const supplyStaked =
      lastTotalStakeUnit === 0 || totalIssuanceUnit === 0
        ? 0
        : lastTotalStakeUnit / totalIssuanceUnit

    // Calculate average daily reward as a percentage of total issuance
    const averageRewardPerDay =
      averageEraValidatorReward.reward * BigInt(erasPerDay)

    const dayRewardRate =
      totalIssuance === 0n
        ? 0
        : new BigNumber(averageRewardPerDay)
            .div(new BigNumber(totalIssuance).div(100))
            .toNumber()

    let inflationToStakers = 0
    if (!compounded) {
      // Base rate without compounding
      inflationToStakers = dayRewardRate * 365
    } else {
      // Daily Compound Interest: A = P[(1+r)^t]
      // Where:
      // A = the future value of the investment
      // P = the principal investment amount
      // r = the daily interest rate (decimal)
      // t = the number of days the money is invested for
      // ^ = ... to the power of ...

      const multipilier = new BigNumber(dayRewardRate)
        .dividedBy(100)
        .plus(1)
        .exponentiatedBy(365)

      inflationToStakers = 100 * Number(multipilier.toString()) - 100
    }

    const rate =
      supplyStaked === 0 ? 0 : Number(inflationToStakers) / supplyStaked

    return rate
  }

  return {
    getAverageRewardRate,
  }
}
