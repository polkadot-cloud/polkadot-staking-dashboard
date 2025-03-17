// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { BalanceChart } from './AccountBalance/BalanceChart'
import { BalanceLinks } from './AccountBalance/BalanceLinks'
import { NetworkStats } from './NetworkSats'
import { Payouts } from './Payouts'
import { StakeStatus } from './StakeStatus'
import { AverageRewardRate } from './Stats/AveragelRewardRate'
import { NextRewards } from './Stats/NextRewards'
import { SupplyStaked } from './Stats/SupplyStaked'

export const Overview = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()

  // Fiat values result in a slightly larger height for Balance & Payouts
  const showFiat = pluginEnabled('staking_api') && network !== 'westend'
  const PAYOUTS_HEIGHT = showFiat ? 385 : 380

  return (
    <>
      <Page.Title title={t('overview')} />
      <Stat.Row>
        <AverageRewardRate />
        <SupplyStaked />
        <NextRewards />
      </Stat.Row>
      <Page.Row>
        <StakeStatus />
      </Page.Row>
      <Page.Row>
        <Page.RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </Page.RowSection>
        <Page.RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <Payouts />
          </CardWrapper>
        </Page.RowSection>
      </Page.Row>
      <Page.Row>
        <NetworkStats />
      </Page.Row>
    </>
  )
}
