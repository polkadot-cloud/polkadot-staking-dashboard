// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { StatsHead } from 'library/StatsHead';
import { Announcements } from './Announcements';
import { Wrapper } from './Wrappers';

export const NetworkStats = () => {
  const { t } = useTranslation('pages');
  const { staking } = useStaking();
  const { metrics } = useNetworkMetrics();
  const { bondedPools } = useBondedPools();

  const { totalNominators, totalValidators, lastReward } = staking;
  const { totalIssuance } = metrics;

  const lastInflation = new BigNumber(lastReward)
    .dividedBy(totalIssuance.dividedBy(100))
    .multipliedBy(365);

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
        totalIssuance.toString() === '0'
          ? '0'
          : lastInflation.decimalPlaces(2).toFormat()
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
