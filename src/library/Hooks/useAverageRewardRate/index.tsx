// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useErasPerDay } from '../useErasPerDay';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import type { AverageRewardRate, UseAverageRewardRate } from './types';
import { defaultAverageRewardRate } from './defaults';
import { useNetwork } from 'contexts/Network';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useApi } from 'contexts/Api';

export const useAverageRewardRate = (): UseAverageRewardRate => {
  const { erasPerDay } = useErasPerDay();
  const { lastTotalStake } = useApi().stakingMetrics;
  const {
    networkMetrics: { totalIssuance },
  } = useApi();
  const { units } = useNetwork().networkData;
  const { avgCommission, averageEraValidatorReward } = useValidators();

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

    // total supply as percent.
    const totalIssuanceUnit = planckToUnit(totalIssuance, units);
    const lastTotalStakeUnit = planckToUnit(lastTotalStake, units);
    const supplyStaked =
      lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
        ? new BigNumber(0)
        : lastTotalStakeUnit.dividedBy(totalIssuanceUnit);

    // Calculate average daily reward as a percentage of total issuance.
    const averageRewardPerDay =
      averageEraValidatorReward.reward.multipliedBy(erasPerDay);
    const dayRewardRate = new BigNumber(averageRewardPerDay).dividedBy(
      totalIssuance.dividedBy(100)
    );

    let inflationToStakers: BigNumber = new BigNumber(0);

    if (!compounded) {
      // Base rate without compounding.
      inflationToStakers = dayRewardRate.multipliedBy(365);
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
      inflationToStakers = new BigNumber(100)
        .multipliedBy(multipilier)
        .minus(100);
    }

    const averageRewardRate = inflationToStakers.dividedBy(supplyStaked);

    return {
      inflationToStakers,
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
