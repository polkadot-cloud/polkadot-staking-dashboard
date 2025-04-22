// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import {
  faCoins,
  faEnvelope,
  faHandHoldingDollar,
  faHistory,
  faPaperPlane,
  faQuestionCircle,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CardHeader, Page } from 'ui-core/base'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useNetwork } from '../../contexts/Network'
import { useActivePool } from '../../contexts/Pools/ActivePool'
import { useStaking } from '../../contexts/Staking'
import { NetworkStats } from './NetworkStats'
import { PriceWidget } from './PriceWidget'
import { StakingHealth } from './StakingHealth'
import { StakingProgress } from './StakingProgress'
import { StakingRecommendation } from './StakingRecommendation'
import { WalletBalance } from './WalletBalance'
import { WelcomeSection } from './WelcomeSection'
import {
  ActionButton,
  CardRow,
  GridLayout,
  HelpOptionsContainer,
  QuickActionsContainer,
} from './Wrappers'

// Quick Actions component
const QuickActions = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { network } = useNetwork()

  // State to track if help options are expanded
  const [helpExpanded, setHelpExpanded] = useState(false)

  // Determine if user is staking via pool or direct nomination
  const isStakingViaPool = inPool()
  // Used to determine appropriate navigation paths
  const isDirectNomination = !inSetup() && !isStakingViaPool

  // Handle stake button click - direct to appropriate page based on staking method
  const handleStakeClick = () => {
    if (isStakingViaPool) {
      navigate('/pools')
    } else if (isDirectNomination) {
      navigate('/nominate')
    } else {
      // Not staking yet, go to staking recommendation page
      navigate('/stake')
    }
  }

  // Handle unstake button click - direct to appropriate page and open unstake modal
  const handleUnstakeClick = () => {
    if (isStakingViaPool) {
      navigate('/pools?action=unstake')
    } else if (isDirectNomination) {
      navigate('/nominate?action=unstake')
    } else {
      // Not staking yet, go to staking page
      navigate('/stake')
    }
  }

  // Toggle help options expanded state
  const toggleHelpOptions = () => {
    setHelpExpanded(!helpExpanded)
  }

  // Handle email support click
  const handleEmailSupport = () => {
    window.open(`mailto:${MailSupportAddress}`, '_blank')
  }

  // Handle discord support click
  const handleDiscordSupport = () => {
    window.open(DiscordSupportUrl, '_blank')
  }

  // Define quick actions
  const actions = [
    {
      icon: faPaperPlane,
      label: t('send'),
      onClick: () => navigate('/transfer'),
    },
    {
      icon: faCoins,
      label: t('stake'),
      onClick: handleStakeClick,
    },
    {
      icon: faHandHoldingDollar,
      label: t('claimRewards'),
      onClick: () => navigate('/rewards'),
    },
    {
      icon: faUnlock,
      label: t('unstake'),
      onClick: handleUnstakeClick,
    },
    // Transaction History is always shown
    {
      icon: faHistory,
      label: t('viewTransactions'),
      onClick: () =>
        activeAddress
          ? window.open(
              `https://${network}.subscan.io/account/${activeAddress}`,
              '_blank'
            )
          : null,
    },
  ]

  return (
    <>
      <CardHeader>
        <h4>{t('quickActions')}</h4>
      </CardHeader>
      <QuickActionsContainer>
        {/* First 5 buttons (2 rows of 2 + 1 on the third row) */}
        {actions.map((action, index) => (
          <ActionButton key={`action-${index}`} onClick={action.onClick}>
            <FontAwesomeIcon icon={action.icon} className="icon" />
            <span className="label">{action.label}</span>
          </ActionButton>
        ))}

        {/* Help button or expanded help options */}
        {helpExpanded ? (
          <HelpOptionsContainer>
            <ActionButton className="help-option" onClick={handleEmailSupport}>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <span className="label">Email</span>
            </ActionButton>
            <ActionButton
              className="help-option"
              onClick={handleDiscordSupport}
            >
              <FontAwesomeIcon icon={faDiscord} className="icon" />
              <span className="label">Discord</span>
            </ActionButton>
          </HelpOptionsContainer>
        ) : (
          <ActionButton className="help-button" onClick={toggleHelpOptions}>
            <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
            <span className="label">{t('requestHelp')}</span>
          </ActionButton>
        )}
      </QuickActionsContainer>
    </>
  )
}

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
          {/* First Row: Wallet Balance (wider) and Quick Actions side by side */}
          <Page.Row>
            <Page.RowSection>
              <GridLayout>
                {/* Wallet Balance - Left (wider) */}
                <CardWrapper>
                  <WalletBalance />
                </CardWrapper>

                {/* Quick Actions - Right */}
                <CardWrapper>
                  <QuickActions />
                </CardWrapper>
              </GridLayout>
            </Page.RowSection>
          </Page.Row>

          {/* Second Row: StakingProgress and StakingHealth - side by side */}
          <Page.Row>
            <Page.RowSection>
              <CardRow>
                {/* StakingProgress on the LEFT */}
                <CardWrapper
                  style={{
                    flex: 1,
                    minHeight: STAKING_HEALTH_HEIGHT,
                    overflow: 'visible',
                    paddingBottom: '3rem',
                  }}
                >
                  <StakingProgress />
                </CardWrapper>

                {/* StakingHealth on the RIGHT */}
                <CardWrapper
                  style={{
                    flex: 1,
                    minHeight: STAKING_HEALTH_HEIGHT,
                    overflow: 'visible',
                    paddingBottom: '3rem',
                  }}
                >
                  {isStakingUser ? (
                    <StakingHealth />
                  ) : (
                    <StakingRecommendation />
                  )}
                </CardWrapper>
              </CardRow>
            </Page.RowSection>
          </Page.Row>

          {/* Third Row: Token Price and Network Stats side by side */}
          <Page.Row>
            <Page.RowSection>
              <CardRow>
                {/* Token Price on the LEFT */}
                <CardWrapper style={{ flex: 1 }}>
                  <PriceWidget />
                </CardWrapper>

                {/* Network Stats on the RIGHT */}
                <CardWrapper style={{ flex: 1 }}>
                  <NetworkStats />
                </CardWrapper>
              </CardRow>
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
