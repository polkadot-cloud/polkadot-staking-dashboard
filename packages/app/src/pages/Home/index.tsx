// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { StakingHealth } from './StakingHealth'
import { StakingRecommendation } from './StakingRecommendation'
import { WalletBalance } from './WalletBalance'

export const Home = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()

  // Determine if user is staking (either in a pool or nominating)
  const isStaking = !inSetup() || inPool()

  // Fiat values result in a slightly larger height for components
  const showFiat = pluginEnabled('staking_api') && network !== 'westend'
  const COMPONENT_HEIGHT = showFiat ? 385 : 380

  return (
    <>
      <Page.Title title={t('home')} />
      <Page.Row>
        <Page.RowSection secondary>
          <CardWrapper height={COMPONENT_HEIGHT}>
            <WalletBalance />
          </CardWrapper>
        </Page.RowSection>
        <Page.RowSection hLast vLast>
          <CardWrapper style={{ minHeight: COMPONENT_HEIGHT }}>
            {isStaking ? <StakingHealth /> : <StakingRecommendation />}
          </CardWrapper>
        </Page.RowSection>
      </Page.Row>
    </>
  )
}
