// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useInflation } from 'library/Hooks/useInflation';
import { StatsHead } from 'library/StatsHead';
import { Announcements } from './Announcements';
import { Wrapper } from './Wrappers';

export const NetworkStats = () => {
  const { t } = useTranslation('pages');
  const { bondedPools } = useBondedPools();
  const { inflation } = useInflation();
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { totalNominators, totalValidators } = staking;
  const { totalIssuance } = metrics;

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
      label: t('overview.inflationRate'),
      value: `${
        totalIssuance.toString() === '0'
          ? '0'
          : new BigNumber(inflation).decimalPlaces(2).toFormat()
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
        <StatsHead items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
