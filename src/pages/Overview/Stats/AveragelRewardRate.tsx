// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Text } from 'library/StatBoxList/Text';
import { useAverageRewardRate } from 'library/Hooks/useAverageRewardRate';
import { useTranslation } from 'react-i18next';

export const AverageRewardRateStat = () => {
  const { t } = useTranslation('pages');
  const { getAverageRewardRate } = useAverageRewardRate();
  // Get the compounded Average Reward Rate.
  const { avgRateBeforeCommission, avgRateAfterCommission } =
    getAverageRewardRate(false);

  const params = {
    label: `${t('overview.averageRewardRate')}`,
    value: `${avgRateBeforeCommission.decimalPlaces(2).toFormat()}%`,
    secondaryValue: `${avgRateAfterCommission.decimalPlaces(2).toFormat()}% ${t(
      'overview.afterCommission'
    )}`,
    helpKey: 'Average Reward Rate',

    primary: true,
  };

  return <Text {...params} />;
};
