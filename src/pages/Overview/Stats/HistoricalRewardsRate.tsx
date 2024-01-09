// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { Text } from 'library/StatBoxList/Text';
import { useValidators } from 'contexts/Validators/ValidatorEntries';

export const HistoricalRewardsRateStat = () => {
  // const { t } = useTranslation('pages');

  const { metrics } = useNetworkMetrics();
  const { avgCommission, avgEraValidatorReward } = useValidators();
  const { totalIssuance } = metrics;

  console.log('total issuance: ', totalIssuance.toString());
  console.log('avg commission: ', avgCommission.toString());
  console.log('30 avg validator reward: ', avgEraValidatorReward.toString());

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
  const averageRewardRate = (): AverageRewardRate => {
    if (
      totalIssuance.isZero() ||
      avgCommission === 0 ||
      avgEraValidatorReward.isZero()
    ) {
      return defaultAvgRewardRate;
    }

    const avgRewardAsPercentOfIssuance = new BigNumber(
      avgEraValidatorReward
    ).dividedBy(totalIssuance.dividedBy(100));

    // TODO: multiply avgRewardAsPercentOfIssuance by how many eras make 1 day.
    const avgRewardRate = avgRewardAsPercentOfIssuance.multipliedBy(365);

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

  // .toFormat()}% ${t('overview.afterInflation')}`;

  const params = {
    label: '30 Day Average Reward Rate',
    value: avgRateBeforeCommission,
    secondaryValue: `${avgRateAfterCommission} after commission`,
    helpKey: 'Historical Rewards Rate', // TODO: replace help item
    primary: true,
  };

  return <Text {...params} />;
};
