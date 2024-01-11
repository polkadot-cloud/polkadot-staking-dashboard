// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useErasPerDay } from '../useErasPerDay';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import type { AverageRewardRate, UseAverageRewardRate } from './types';
import { defaultAverageRewardRate } from './defaults';

export const useAverageRewardRate = (): UseAverageRewardRate => {
  const { erasPerDay } = useErasPerDay();
  const { metrics } = useNetworkMetrics();
  const { avgCommission, averageEraValidatorReward } = useValidators();
  const { totalIssuance } = metrics;

  // Get average reward rates.
  const getAverageRewardRate = (compounded: boolean): AverageRewardRate => {
    if (
      totalIssuance.isZero() ||
      erasPerDay.isZero() ||
      avgCommission === 0 ||
      averageEraValidatorReward.reward.isZero()
    ) {
      return defaultAverageRewardRate;
    }

    // Calculate average daily reward as a percentage of total issuance.
    const averageRewardPerDay =
      averageEraValidatorReward.reward.multipliedBy(erasPerDay);
    const dayRewardRate = new BigNumber(averageRewardPerDay).dividedBy(
      totalIssuance.dividedBy(100)
    );

    let averageRewardRate: BigNumber = new BigNumber(0);

    if (!compounded) {
      // Base rate without compounding.
      averageRewardRate = dayRewardRate.multipliedBy(365);
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
        .exponentiatedBy(365);
      averageRewardRate = new BigNumber(100)
        .multipliedBy(multipilier)
        .minus(100);
    }

    return {
      avgRateBeforeCommission: averageRewardRate,
      avgRateAfterCommission: averageRewardRate.minus(
        averageRewardRate.multipliedBy(avgCommission * 0.01)
      ),
    };
  };

  return {
    getAverageRewardRate,
  };
};
