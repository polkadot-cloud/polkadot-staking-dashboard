// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import {
  PageHeading,
  PageRow,
  PageTitle,
  RowSection,
  StatRow,
} from 'ui-core/base'
import { BalanceChart } from './AccountBalance/BalanceChart'
import { BalanceLinks } from './AccountBalance/BalanceLinks'
import { AccountControls } from './AccountControls'
import { NetworkStats } from './NetworkSats'
import { Payouts } from './Payouts'
import { StakeStatus } from './StakeStatus'
import { AverageRewardRate } from './Stats/AveragelRewardRate'
import { NextRewards } from './Stats/NextRewards'
import { SupplyStaked } from './Stats/SupplyStaked'

export const Overview = () => {
  const { t } = useTranslation('pages')
  const PAYOUTS_HEIGHT = 380

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      {/* TODO: Remove these when ready to merge */}
      <PageRow>
        <p style={{ color: 'var(--accent-color-primary-5)' }}>Polkadot&nbsp;</p>
        <p style={{ color: 'var(--accent-color-primary-10)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-15)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-20)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-25)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-30)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-35)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-40)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-45)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-50)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-55)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-60)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-65)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-70)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-75)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-80)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-85)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-90)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-primary-95)' }}>
          Polkadot&nbsp;
        </p>
      </PageRow>
      <PageRow>
        <p style={{ color: 'var(--accent-color-secondary-5)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-10)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-15)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-20)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-25)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-30)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-35)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-40)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-45)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-50)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-55)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-60)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-65)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-70)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-75)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-80)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-85)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-90)' }}>
          Polkadot&nbsp;
        </p>
        <p style={{ color: 'var(--accent-color-secondary-95)' }}>
          Polkadot&nbsp;
        </p>
      </PageRow>
      <PageRow>
        <PageHeading>
          <AccountControls />
        </PageHeading>
      </PageRow>
      <StatRow>
        <AverageRewardRate />
        <SupplyStaked />
        <NextRewards />
      </StatRow>
      <PageRow>
        <StakeStatus />
      </PageRow>
      <PageRow>
        <RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <Payouts />
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <NetworkStats />
      </PageRow>
    </>
  )
}
