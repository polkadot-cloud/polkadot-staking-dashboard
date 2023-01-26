// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import useInflation from 'library/Hooks/useInflation';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';

export const HistoricalRewardsRateStatBox = () => {
  const { t } = useTranslation('pages');
  const { metrics } = useNetworkMetrics();
  const { inflation, stakedReturn } = useInflation();
  const { totalIssuance } = metrics;

  const value = `${
    totalIssuance.toString() === '0' ? '0' : toFixedIfNecessary(stakedReturn, 2)
  }%`;

  const secondaryValue =
    totalIssuance.toString() === '0' || stakedReturn === 0
      ? undefined
      : `/ ${toFixedIfNecessary(Math.max(0, stakedReturn - inflation), 2)}% ${t(
          'overview.afterInflation'
        )}`;

  const params = {
    label: t('overview.historicalRewardsRate'),
    value,
    secondaryValue,
    helpKey: 'Historical Rewards Rate',
    primary: true,
  };

  return <Text {...params} />;
};

export default HistoricalRewardsRateStatBox;
