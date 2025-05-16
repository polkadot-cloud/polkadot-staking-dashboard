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
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { getNetworkData } from 'consts/util'
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
import { useTransferOptions } from '../../contexts/TransferOptions'
import { CompactStakeInfo } from './CompactStakeInfo'
import { NetworkStats } from './NetworkStats'
import { PriceWidget } from './PriceWidget'
import { StakingHealth } from './StakingHealth'
import { StakingProgress } from './StakingProgress'
import { StakingRecommendation } from './StakingRecommendation'
import { WalletBalance } from './WalletBalance'
import { WelcomeSection } from './WelcomeSection'
import {
  ActionButton,
  BalanceCardsLayout,
  CardRow,
  HelpOptionsContainer,
  QuickActionsContainer,
} from './Wrappers'

// Quick Actions component
const QuickActions = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()
  const { network } = useNetwork()
  const { openModal } = useOverlay().modal
  const { openCanvas } = useOverlay().canvas
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool, activePool } = useActivePool()
  const { isNominating } = useStaking()
  const { getPendingPoolRewards, getAccountBalance } = useBalances()
  const { getStakedBalance } = useTransferOptions()

  // State to track if help options are expanded
  const [helpExpanded, setHelpExpanded] = useState(false)
  // State to track if rewards options are expanded
  const [rewardsExpanded, setRewardsExpanded] = useState(false)

  // Determine if user is staking via pool or direct nomination
  const isStakingViaPool = inPool()
  // Used to determine appropriate navigation paths
  const isDirectNomination = !inSetup() && !isStakingViaPool

  // Check if the user has any staked tokens
  const stakedBalance = getStakedBalance(activeAddress)
  const hasStakedTokens = stakedBalance.gt(0)

  // Get user's free balance
  const { balance } = getAccountBalance(activeAddress)
  const { units } = getNetworkData(network)
  const freeBalance = new BigNumber(planckToUnit(balance.free, units))

  // Get network-specific minimums from StakingRecommendation
  const networkMinimums = {
    polkadot: {
      directNomination: 250, // 250 DOT for direct nomination on Polkadot
      poolStaking: 1, // 1 DOT to join a pool on Polkadot
      minBalanceWithFees: 1.2, // Minimum balance needed including transaction fees
    },
    kusama: {
      directNomination: 0.1, // 0.1 KSM for direct nomination on Kusama
      poolStaking: 0.002, // 0.002 KSM to join a pool on Kusama
      minBalanceWithFees: 0.02, // Minimum balance needed including transaction fees
    },
    westend: {
      directNomination: 1, // 1 WND for direct nomination on Westend
      poolStaking: 0.1, // 0.1 WND to join a pool on Westend
      minBalanceWithFees: 0.15, // Minimum balance needed including transaction fees
    },
  }[network]

  // Determine if user has enough balance for staking
  const hasEnoughToStake = freeBalance.isGreaterThanOrEqualTo(
    networkMinimums.minBalanceWithFees
  )

  // Determine if user has enough for direct nomination
  const hasEnoughForDirectNomination = freeBalance.isGreaterThanOrEqualTo(
    networkMinimums.directNomination
  )

  // Handle stake button click - open modal directly instead of navigating
  const handleStakeClick = () => {
    if (isStakingViaPool) {
      // For pool stakers: open pool bond modal directly
      openModal({
        key: 'Bond',
        options: { bondFor: 'pool' },
        size: 'sm',
      })
    } else if (isDirectNomination) {
      // For direct nominators: open nominator bond modal directly
      openModal({
        key: 'Bond',
        options: { bondFor: 'nominator' },
        size: 'sm',
      })
    } else if (hasEnoughToStake) {
      // Not staking yet, but has enough balance - open canvas based on recommendation
      if (hasEnoughForDirectNomination) {
        // For users with enough for direct nomination, open ManageNominations canvas
        openCanvas({
          key: 'NominatorSetup',
          options: {},
          size: 'lg',
        })
      } else {
        // For users with enough for pool staking but not direct nomination, open Pool canvas
        openCanvas({
          key: 'Pool',
          options: {},
          size: 'xl',
        })
      }
    } else {
      // Not enough balance, show recommendation page
      navigate('/stake')
    }
  }

  // Determine stake button text and disabled state
  const getStakeButtonProps = () => {
    // Default stake button properties
    const defaultProps = {
      icon: faCoins,
      label: t('stake'),
      onClick: handleStakeClick,
      disabled: !activeAddress,
    }

    if (!activeAddress) {
      // No wallet connected
      return defaultProps
    }

    if (isStakingViaPool) {
      // Already staking via pool - use specific label
      return {
        ...defaultProps,
        label: t('stake'),
      }
    }

    if (isDirectNomination) {
      // Already doing direct nomination - use specific label
      return {
        ...defaultProps,
        label: t('stake'),
      }
    }

    if (!hasEnoughToStake) {
      // Not enough balance to stake
      return {
        ...defaultProps,
        disabled: true,
      }
    }

    // Not staking yet, but has enough balance - change button text based on recommendation
    return {
      ...defaultProps,
      label: t('stakeBasedOnRecommendation'),
    }
  }

  // Handle unstake button click - direct to appropriate page and open unstake modal
  const handleUnstakeClick = () => {
    if (isStakingViaPool) {
      // For pool stakers: open pool unbond modal directly
      openModal({
        key: 'Unbond',
        options: { bondFor: 'pool' },
        size: 'sm',
      })
    } else if (isDirectNomination) {
      // For direct nominators: open unstake modal directly
      openModal({
        key: 'Unstake',
        size: 'sm',
      })
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

  // Get pending rewards for pool member
  const pendingRewards = getPendingPoolRewards(activeAddress)
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
        disabled: !hasStakedTokens,
      }
    }

    // This is the "Stake to Earn Rewards" button case
    if (activeAddress) {
      return {
        icon: faHandHoldingDollar,
        label: t('notStakingRewards'),
        onClick: () => navigate('/stake'),
        // Grey out the button even when wallet has funds but isn't staking yet
        // The user should not be able to view rewards until they are staking
        disabled: true,
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
  const stakeButtonProps = getStakeButtonProps()

  // Define quick actions
  const actions = [
    {
      icon: faPaperPlane,
      label: t('send'),
      onClick: () => openModal({ key: 'Send', size: 'sm' }),
      // Disable send button if there's no balance to send
      disabled: !activeAddress || freeBalance.isLessThanOrEqualTo(0),
    },
    {
      icon: stakeButtonProps.icon,
      label: stakeButtonProps.label,
      onClick: stakeButtonProps.onClick,
      disabled: stakeButtonProps.disabled,
    },
    {
      component:
        rewardsExpanded && inPool() && hasRewards ? (
          <HelpOptionsContainer className="rewards-options">
            <ActionButton
              className="reward-option"
              onClick={handleWithdrawRewards}
              disabled={!hasStakedTokens}
            >
              <FontAwesomeIcon icon={faCircleDown} className="icon" />
              <span className="label">{t('withdraw')}</span>
            </ActionButton>
            <ActionButton
              className="reward-option"
              onClick={handleCompoundRewards}
              disabled={
                !hasStakedTokens ||
                activePool?.bondedPool?.state === 'Destroying'
              }
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
      // Disable unstake if there's nothing staked
      disabled: !hasStakedTokens,
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
      disabled: !activeAddress,
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
            <ActionButton
              key={`action-${index}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
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

      {/* Only show additional cards if user has an active account */}
      {activeAccount && (
        <>
          {isStakingUser ? (
            <>
              {/* For actively staking users: Welcome and Quick Actions on the same row */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Welcome Section */}
                    <CardWrapper className="welcome-section">
                      <WelcomeSection />
                    </CardWrapper>

                    {/* Quick Actions */}
                    <CardWrapper className="quick-actions-card">
                      <QuickActions />
                    </CardWrapper>
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>

              {/* For actively staking users: Wallet Balance and Staking Info on the same row */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Wallet Balance */}
                    <CardWrapper>
                      <WalletBalance />
                    </CardWrapper>

                    {/* Staking Info */}
                    <CardWrapper>
                      <CompactStakeInfo />
                    </CardWrapper>
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>
            </>
          ) : (
            <>
              {/* For non-staking users: Welcome Section at the top */}
              <Page.Row>
                <Page.RowSection>
                  <CardWrapper className="welcome-section">
                    <WelcomeSection />
                  </CardWrapper>
                </Page.RowSection>
              </Page.Row>

              {/* For non-staking users: Wallet Balance and Quick Actions side by side */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Wallet Balance - Left */}
                    <CardWrapper>
                      <WalletBalance />
                    </CardWrapper>

                    {/* Quick Actions - Right */}
                    <CardWrapper className="quick-actions-card">
                      <QuickActions />
                    </CardWrapper>
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>
            </>
          )}

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

      {/* Show Welcome and Price Widget for users without an active account */}
      {!activeAccount && (
        <>
          {/* Welcome Section for non-connected users */}
          <Page.Row>
            <Page.RowSection>
              <CardWrapper>
                <WelcomeSection />
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>

          {/* Price Widget for non-connected users */}
          <Page.Row>
            <Page.RowSection>
              <CardWrapper>
                <PriceWidget />
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>
        </>
      )}
    </>
  )
}
