// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { StatBoxList } from 'library/StatBoxList'
import { useTranslation } from 'react-i18next'
import { PageHeading, PageRow, PageTitle, RowSection } from 'ui-core/base'
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
      <PageRow>
        <PageHeading>
          <AccountControls />
        </PageHeading>
      </PageRow>
      <StatBoxList>
        <AverageRewardRate />
        <SupplyStaked />
        <NextRewards />
      </StatBoxList>
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
