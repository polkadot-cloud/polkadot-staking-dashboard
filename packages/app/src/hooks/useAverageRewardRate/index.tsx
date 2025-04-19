// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { planckToUnitBn } from 'utils'
import { useErasPerDay } from '../useErasPerDay'
import { defaultAverageRewardRate } from './defaults'
import type { AverageRewardRate, UseAverageRewardRate } from './types'

export const useAverageRewardRate = (): UseAverageRewardRate => {
  const { erasPerDay } = useErasPerDay()
  const { lastTotalStake } = useApi().stakingMetrics
  const {
    relayMetrics: { totalIssuance },
  } = useApi()
  const { network } = useNetwork()
  const { avgCommission, averageEraValidatorReward } = useValidators()
  const { units } = getNetworkData(network)

  // Get average reward rates.
  const getAverageRewardRate = (compounded: boolean): AverageRewardRate => {
    if (
      totalIssuance === 0n ||
      erasPerDay === 0 ||
      avgCommission === 0 ||
      averageEraValidatorReward.reward.isZero()
    ) {
      return defaultAverageRewardRate
    }

    // total supply as percent.
    const totalIssuanceUnit = new BigNumber(planckToUnit(totalIssuance, units))
    const lastTotalStakeUnit = planckToUnitBn(lastTotalStake, units)
    const supplyStaked =
      lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
        ? new BigNumber(0)
        : lastTotalStakeUnit.dividedBy(totalIssuanceUnit)

    // Calculate average daily reward as a percentage of total issuance.
    const averageRewardPerDay =
      averageEraValidatorReward.reward.multipliedBy(erasPerDay)
    const dayRewardRate = new BigNumber(averageRewardPerDay).dividedBy(
      totalIssuance / 100n
    )

    let inflationToStakers: BigNumber = new BigNumber(0)

    if (!compounded) {
      // Base rate without compounding.
      inflationToStakers = dayRewardRate.multipliedBy(365)
    } else {
      // Daily Compound Interest: A = P[(1+r)^t]
      // Where:
      // A = the future value of the investment
      // P = the principal investment amount
      // r = the daily interest rate (decimal)
      // t = the number of days the money is invested for
      // ^ = ... to the power of ...

      const multipilier = dayRewardRate
        .dividedBy(100)
        .plus(1)
        .exponentiatedBy(365)
      inflationToStakers = new BigNumber(100)
        .multipliedBy(multipilier)
        .minus(100)
    }

    const averageRewardRate = inflationToStakers.dividedBy(supplyStaked)

    return {
      inflationToStakers,
      avgRateBeforeCommission: averageRewardRate,
      avgRateAfterCommission: averageRewardRate.minus(
        averageRewardRate.multipliedBy(avgCommission * 0.01)
      ),
    }
  }

  return {
    getAverageRewardRate,
  }
}
