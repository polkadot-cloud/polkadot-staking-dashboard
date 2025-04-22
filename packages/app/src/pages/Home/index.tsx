// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import {
  faChartLine,
  faCircleDown,
  faCoins,
  faEnvelope,
  faHandHoldingDollar,
  faHistory,
  faPaperPlane,
  faPlus,
  faQuestionCircle,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { CardWrapper } from 'library/Card/Wrappers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CardHeader, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useBalances } from '../../contexts/Balances'
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
  const { network } = useNetwork()
  const { openModal } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool, activePool } = useActivePool()
  const { isNominating } = useStaking()
  const { getBalance } = useBalances()

  // State to track if help options are expanded
  const [helpExpanded, setHelpExpanded] = useState(false)
  // State to track if rewards options are expanded
  const [rewardsExpanded, setRewardsExpanded] = useState(false)

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
    // Close rewards options if open
    if (rewardsExpanded) {
      setRewardsExpanded(false)
    }
  }

  // Toggle rewards options expanded state
  const toggleRewardsOptions = () => {
    setRewardsExpanded(!rewardsExpanded)
    // Close help options if open
    if (helpExpanded) {
      setHelpExpanded(false)
    }
  }

  // Handle email support click
  const handleEmailSupport = () => {
    window.open(`mailto:${MailSupportAddress}`, '_blank')
  }

  // Handle discord support click
  const handleDiscordSupport = () => {
    window.open(DiscordSupportUrl, '_blank')
  }

  // Handle withdraw rewards click
  const handleWithdrawRewards = () => {
    openModal({
      key: 'ClaimReward',
      options: { claimType: 'withdraw' },
      size: 'sm',
    })
  }

  // Handle compound rewards click
  const handleCompoundRewards = () => {
    openModal({
      key: 'ClaimReward',
      options: { claimType: 'bond' },
      size: 'sm',
    })
  }

  // Check if user has a wallet with funds
  const hasWallet = activeAddress && getBalance(activeAddress)?.free.gt(0)

  // Get pending rewards for pool member
  const pendingRewards = activePool?.pendingRewards || 0n
  const minUnclaimedDisplay = 1000000n
  const hasRewards = pendingRewards > minUnclaimedDisplay

  // Determine the claim rewards action based on user status
  const getClaimRewardsAction = () => {
    if (!activeAddress) {
      return {
        icon: faHandHoldingDollar,
        label: t('claimRewards'),
        onClick: () => {},
        disabled: true,
      }
    }

    if (inPool()) {
      if (hasRewards) {
        return {
          icon: faHandHoldingDollar,
          label: t('claimRewards'),
          onClick: toggleRewardsOptions,
          expanded: rewardsExpanded,
        }
      }
      return {
        icon: faHandHoldingDollar,
        label: t('noRewardsToClaimShort'),
        onClick: () => {},
        disabled: true,
      }
    }

    if (isNominating()) {
      return {
        icon: faChartLine,
        label: t('viewRewards'),
        onClick: () => navigate('/rewards'),
      }
    }

    if (hasWallet) {
      return {
        icon: faHandHoldingDollar,
        label: t('notStakingRewards'),
        onClick: () => navigate('/stake'),
      }
    }

    return {
      icon: faHandHoldingDollar,
      label: t('claimRewards'),
      onClick: () => {},
      disabled: true,
    }
  }

  const claimRewardsAction = getClaimRewardsAction()

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
      component:
        rewardsExpanded && inPool() && hasRewards ? (
          <HelpOptionsContainer className="rewards-options">
            <ActionButton
              className="reward-option"
              onClick={handleWithdrawRewards}
            >
              <FontAwesomeIcon icon={faCircleDown} className="icon" />
              <span className="label">{t('withdraw')}</span>
            </ActionButton>
            <ActionButton
              className="reward-option"
              onClick={handleCompoundRewards}
              disabled={activePool?.bondedPool?.state === 'Destroying'}
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              <span className="label">{t('compound')}</span>
            </ActionButton>
          </HelpOptionsContainer>
        ) : (
          <ActionButton
            onClick={claimRewardsAction.onClick}
            disabled={claimRewardsAction.disabled}
            $expanded={claimRewardsAction.expanded}
          >
            <FontAwesomeIcon icon={claimRewardsAction.icon} className="icon" />
            <span className="label">{claimRewardsAction.label}</span>
          </ActionButton>
        ),
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
        {actions.map((action, index) => {
          if (action.component) {
            return (
              <React.Fragment key={`action-component-${index}`}>
                {action.component}
              </React.Fragment>
            )
          }
          return (
            <ActionButton key={`action-${index}`} onClick={action.onClick}>
              <FontAwesomeIcon icon={action.icon} className="icon" />
              <span className="label">{action.label}</span>
            </ActionButton>
          )
        })}

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
