// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useActivePool } from '../../contexts/Pools/ActivePool'
import { useStaking } from '../../contexts/Staking'
import { NetworkStats } from './NetworkStats'
import { PriceWidget } from './PriceWidget'
import { StakingHealth } from './StakingHealth'
import { StakingRecommendation } from './StakingRecommendation'
import { WalletBalance } from './WalletBalance'
import { WelcomeSection } from './WelcomeSection'

export const Home = () => {
  const { t } = useTranslation('pages')
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { activeAccount } = useActiveAccounts()

  // Check if user is staking
  const isStakingUser = !inSetup() || inPool()

  // Define height for staking health card
  const STAKING_HEALTH_HEIGHT = 450

  return (
    <>
      <Page.Title title={t('home')} />

      {/* Welcome Section - full width */}
      <Page.Row>
        <Page.RowSection>
          <CardWrapper>
            <WelcomeSection />
          </CardWrapper>
        </Page.RowSection>
      </Page.Row>

      {/* Only show additional cards if user has an active account */}
      {activeAccount && (
        <>
          {/* Row with side-by-side content */}
          <Page.Row>
            <Page.RowSection secondary>
              <CardWrapper>
                <WalletBalance />
              </CardWrapper>
            </Page.RowSection>
            <Page.RowSection hLast>
              <CardWrapper style={{ marginBottom: '1rem' }}>
                <PriceWidget />
              </CardWrapper>
              <CardWrapper>
                <NetworkStats />
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>

          {/* Staking Health - full width */}
          <Page.Row>
            <Page.RowSection>
              <CardWrapper
                style={{
                  minHeight: STAKING_HEALTH_HEIGHT,
                  overflow: 'visible',
                  paddingBottom: '3rem',
                }}
              >
                {isStakingUser ? <StakingHealth /> : <StakingRecommendation />}
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>
        </>
      )}

      {/* Show Price Widget for users without an active account */}
      {!activeAccount && (
        <Page.Row>
          <Page.RowSection>
            <CardWrapper>
              <PriceWidget />
            </CardWrapper>
          </Page.RowSection>
        </Page.Row>
      )}
    </>
  )
}
