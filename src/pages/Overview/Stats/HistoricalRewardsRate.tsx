// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useInflation } from 'library/Hooks/useInflation';
import { Text } from 'library/StatBoxList/Text';

export const HistoricalRewardsRateStat = () => {
  const { t } = useTranslation('pages');
  const { metrics } = useNetworkMetrics();
  const { inflation, stakedReturn } = useInflation();
  const { totalIssuance } = metrics;

  const value = `${
    totalIssuance.isZero()
      ? '0'
      : new BigNumber(stakedReturn).decimalPlaces(2).toFormat()
  }%`;

  const secondaryValue =
    totalIssuance.isZero() || stakedReturn === 0
      ? undefined
      : `/ ${new BigNumber(Math.max(0, stakedReturn - inflation))
          .decimalPlaces(2)
          .toFormat()}% ${t('overview.afterInflation')}`;

  const params = {
    label: t('overview.historicalRewardsRate'),
    value,
    secondaryValue,
    helpKey: 'Historical Rewards Rate',
    primary: true,
  };

  return <Text {...params} />;
};
