// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { Header } from 'library/Announcements/Header'
import { Wrapper } from 'library/Announcements/Wrappers'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { CardHeader } from 'ui-core/base'
import { Announcements } from './Announcements'

export const NetworkStats = () => {
  const { t } = useTranslation('pages')
  const { bondedPools } = useBondedPools()
  const { getAverageRewardRate } = useAverageRewardRate()
  const { counterForNominators, totalValidators } = useApi().stakingMetrics

  const { inflationToStakers } = getAverageRewardRate(false)

  const items = [
    {
      label: t('totalValidators'),
      value: totalValidators.toFormat(0),
      helpKey: 'Validator',
    },
    {
      label: t('totalNominators'),
      value: counterForNominators.toFormat(0),
      helpKey: 'Total Nominators',
    },
    {
      label: t('activePools'),
      value: new BigNumber(bondedPools.length).toFormat(),
      helpKey: 'Active Pools',
    },
    {
      label: t('latestInflationRate'),
      value: `${
        inflationToStakers.toString() === '0'
          ? '0'
          : inflationToStakers.decimalPlaces(2).toFormat()
      }%`,
      helpKey: 'Inflation',
    },
  ]

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeader margin>
        <h3>{t('networkStats')}</h3>
      </CardHeader>
      <Wrapper>
        <Header items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  )
}
