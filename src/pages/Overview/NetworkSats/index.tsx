// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { Header } from 'library/Announcements/Header';
import { Wrapper } from 'library/Announcements/Wrappers';
import { Announcements } from './Announcements';
import { useAverageRewardRate } from 'hooks/useAverageRewardRate';
import { useApi } from 'contexts/Api';

export const NetworkStats = () => {
  const { t } = useTranslation('pages');
  const { bondedPools } = useBondedPools();
  const { getAverageRewardRate } = useAverageRewardRate();
  const { totalNominators, totalValidators } = useApi().stakingMetrics;

  const { inflationToStakers } = getAverageRewardRate(false);

  const items = [
    {
      label: t('overview.totalValidators'),
      value: totalValidators.toFormat(0),
      helpKey: 'Validator',
    },
    {
      label: t('overview.totalNominators'),
      value: totalNominators.toFormat(0),
      helpKey: 'Total Nominators',
    },
    {
      label: t('overview.activePools'),
      value: new BigNumber(bondedPools.length).toFormat(),
      helpKey: 'Active Pools',
    },
    {
      label: t('overview.latestInflationRate'),
      value: `${
        inflationToStakers.toString() === '0'
          ? '0'
          : inflationToStakers.decimalPlaces(2).toFormat()
      }%`,
      helpKey: 'Inflation',
    },
  ];

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeaderWrapper $withMargin>
        <h3>{t('overview.networkStats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
