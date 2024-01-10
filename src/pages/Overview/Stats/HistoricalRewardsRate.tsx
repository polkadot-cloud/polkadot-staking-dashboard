// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { Text } from 'library/StatBoxList/Text';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useErasPerDay } from 'library/Hooks/useErasPerDay';

export const HistoricalRewardsRateStat = () => {
  // const { t } = useTranslation('pages');

  const { metrics } = useNetworkMetrics();
  const { erasPerDay } = useErasPerDay();
  const { avgCommission, avgEraValidatorReward } = useValidators();
  const { totalIssuance } = metrics;

  interface AverageRewardRate {
    avgRateBeforeCommission: string;
    avgRateAfterCommission: string;
  }

  const defaultAvgRewardRate: AverageRewardRate = {
    avgRateBeforeCommission: '0%',
    avgRateAfterCommission: '0%',
  };

  // Calculates the average reward rate over the last 30 days.
  // TODO: move to a hook.
  const compounded = true;
  const averageRewardRate = (): AverageRewardRate => {
    if (
      totalIssuance.isZero() ||
      erasPerDay.isZero() ||
      avgCommission === 0 ||
      avgEraValidatorReward.isZero()
    ) {
      return defaultAvgRewardRate;
    }

    // Calculate average daily reward as a percentage of total issuance.
    const avgRewardPerDay = avgEraValidatorReward.multipliedBy(erasPerDay);
    const dayRewardRate = new BigNumber(avgRewardPerDay).dividedBy(
      totalIssuance.dividedBy(100)
    );

    let avgRewardRate: BigNumber = new BigNumber(0);

    if (!compounded) {
      // Base rate without compounding.
      avgRewardRate = dayRewardRate.multipliedBy(365);
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
      avgRewardRate = new BigNumber(100).multipliedBy(multipilier).minus(100);
    }

    return {
      avgRateBeforeCommission: `${avgRewardRate.decimalPlaces(2).toFormat()}%`,
      avgRateAfterCommission: `${avgRewardRate
        .minus(avgRewardRate.multipliedBy(avgCommission * 0.01))
        .decimalPlaces(2)
        .toFormat()}%`,
    };
  };

  const { avgRateBeforeCommission, avgRateAfterCommission } =
    averageRewardRate();

  const params = {
    label: '30 Day Average Reward Rate',
    value: avgRateBeforeCommission,
    secondaryValue: `${avgRateAfterCommission} after commission`,
    helpKey: 'Historical Rewards Rate', // TODO: replace help item
    primary: true,
  };

  return <Text {...params} />;
};
