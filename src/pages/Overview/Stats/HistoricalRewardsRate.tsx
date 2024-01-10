// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Text } from 'library/StatBoxList/Text';
import { useAverageRewardRate } from 'library/Hooks/useAverageRewardRate';

export const HistoricalRewardsRateStat = () => {
  // const { t } = useTranslation('pages');
  const { getAverageRewardRate } = useAverageRewardRate();

  // Get the compounded 30 Day Average Reward Rate.
  const { avgRateBeforeCommission, avgRateAfterCommission } =
    getAverageRewardRate(true);

  const params = {
    label: '30 Day Average Reward Rate',
    value: `${avgRateBeforeCommission.decimalPlaces(2).toFormat()}%`,
    secondaryValue: `${avgRateAfterCommission
      .decimalPlaces(2)
      .toFormat()}% after commission`,
    helpKey: 'Average Reward Rate',

    primary: true,
  };

  return <Text {...params} />;
};
