// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faAward,
  faBookOpen,
  faChartLine,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CardHeader } from 'ui-core/base'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useHelp } from '../../contexts/Help'
import { useActivePool } from '../../contexts/Pools/ActivePool'
import { useStaking } from '../../contexts/Staking'
import {
  QuickActionButton,
  QuickActionsContainer,
  SectionTitle,
} from './StakingHealth/Wrappers'
import { Wrapper } from './Wrappers'

// Styled components specific to StakingProgress
const ProgressContainer = styled.div`
  margin: 1rem 0;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: var(--background-secondary);
  border-radius: 0.25rem;
  margin: 0.5rem 0 1rem;
  overflow: hidden;
  position: relative;

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--network-color-primary);
    transition: width 0.3s ease;
  }
`

const ChecklistContainer = styled.div`
  margin: 1rem 0;
`

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: var(--background-secondary);
  }

  .icon {
    margin-right: 0.75rem;
    width: 1.5rem;
    text-align: center;
    color: var(--network-color-primary);
  }

  .item-content {
    flex: 1;

    .item-title {
      font-weight: 600;
      color: var(--text-color-primary);
      margin-bottom: 0.25rem;
    }

    .item-description {
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }

    .item-supplementary {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      margin-top: 0.25rem;
    }
  }

  &.completed {
    opacity: 0.7;
  }
`

const MilestoneContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;

  .milestone-icon {
    font-size: 1.5rem;
    color: var(--status-success-color);
    margin-right: 1rem;
  }

  .milestone-content {
    flex: 1;

    .milestone-title {
      font-weight: 600;
      color: var(--text-color-primary);
      margin-bottom: 0.25rem;
    }

    .milestone-description {
      color: var(--text-color-secondary);
      font-size: 0.95rem;
    }
  }
`

// Define types for our components
interface StepItem {
  title: string
  description: string
  supplementary?: string
  completed: boolean
}

interface MilestoneItem {
  title: string
  description: string
}

interface QuickAction {
  title: string
  description: string
  onClick: () => void
  icon: IconDefinition
}

export const StakingProgress = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()

  // Get context data
  const { activeAccount } = useActiveAccounts()
  const { isNominating, isBonding, inSetup } = useStaking()
  const { inPool, activePoolNominations } = useActivePool()
  const { openHelp } = useHelp()

  // Calculate staking progress based on actual user state
  const calculateProgress = () => {
    let completedSteps = 0
    const totalSteps = 4

    // Step 1: Wallet connected
    if (activeAccount) {
      completedSteps++
    }

    // Step 2: Staking method chosen
    if (isBonding() || inPool()) {
      completedSteps++
    }

    // Step 3: Validators selected or pool joined
    if (isNominating() || inPool()) {
      completedSteps++
    }

    // Step 4: Optimized staking or pool monitoring
    if ((isNominating() && !inSetup()) || inPool()) {
      completedSteps++
    }

    const percentage = Math.round((completedSteps / totalSteps) * 100)

    return { percentage, completedSteps, totalSteps }
  }

  const progress = calculateProgress()

  // Determine milestones based on actual user achievements
  const getMilestones = () => {
    const milestones: MilestoneItem[] = []

    // First stake milestone - show if user is staking
    if (isNominating() || inPool()) {
      milestones.push({
        title: t('milestoneFirstStake'),
        description: t('milestoneFirstStakeDesc'),
      })
    }

    return milestones
  }

  // Get next steps based on current progress
  const getNextSteps = () => {
    const steps: StepItem[] = []

    // Step 1: Connect wallet
    steps.push({
      title: t('connectWallet'),
      description: activeAccount
        ? t('walletConnected')
        : t('connectWalletDesc'),
      completed: !!activeAccount,
    })

    // Step 2: Choose staking method
    const stakingMethodChosen = isBonding() || inPool()
    steps.push({
      title: t('chooseStakingMethod'),
      description: stakingMethodChosen
        ? inPool()
          ? t('poolStakingSelected')
          : t('directNominationSelected')
        : t('chooseStakingMethodDesc'),
      supplementary: !stakingMethodChosen
        ? t('chooseStakingMethodSupplementary')
        : undefined,
      completed: stakingMethodChosen,
    })

    // Step 3: Setup staking (previously Select validators or join pool)
    const step3Completed = isNominating() || inPool()

    steps.push({
      title: t('setupStaking'),
      description: step3Completed
        ? inPool()
          ? t('poolJoined')
          : t('validatorsSelected', {
              count:
                inPool() &&
                activePoolNominations &&
                activePoolNominations.targets
                  ? activePoolNominations.targets.length
                  : 16, // Default to 16 validators for direct nomination
            })
        : t('setupStakingDesc'),
      completed: step3Completed,
    })

    // Step 4: Optimize staking or monitor pool
    const step4Completed = (isNominating() && !inSetup()) || inPool()

    steps.push({
      title: t('optimizeStaking'),
      description: step4Completed
        ? inPool()
          ? t('poolPerformanceMonitored')
          : t('stakingOptimized')
        : t('optimizeStakingDesc'),
      completed: step4Completed,
    })

    return steps
  }

  // Open the Resources modal
  const openResourcesModal = () => {
    // Open the Resources help section
    openHelp('resources')
  }

  // Get quick actions for the What's Next section
  const getQuickActions = () => {
    const actions: QuickAction[] = []

    // First action based on user status
    if (!activeAccount) {
      // If no wallet connected, show track rewards
      actions.push({
        title: t('trackRewards'),
        description: t('trackRewardsDesc'),
        onClick: () => navigate('/rewards'),
        icon: faChartLine,
      })
    } else if (!isBonding() && !inPool()) {
      // If wallet connected but not staking, show track rewards
      actions.push({
        title: t('trackRewards'),
        description: t('trackRewardsDesc'),
        onClick: () => navigate('/rewards'),
        icon: faChartLine,
      })
    } else {
      // If already staking, show track rewards action
      actions.push({
        title: t('trackRewards'),
        description: t('trackRewardsDesc'),
        onClick: () => navigate('/rewards'),
        icon: faChartLine,
      })
    }

    // Second action based on user status
    if (!activeAccount) {
      // If no wallet connected, show learn more about staking
      actions.push({
        title: t('learnMoreAboutStaking'),
        description: t('learnMoreAboutStakingDesc'),
        onClick: openResourcesModal,
        icon: faBookOpen,
      })
    } else if (!isBonding() && !inPool()) {
      // If wallet connected but not staking, show learn more about staking
      actions.push({
        title: t('learnMoreAboutStaking'),
        description: t('learnMoreAboutStakingDesc'),
        onClick: openResourcesModal,
        icon: faBookOpen,
      })
    } else if (progress.percentage < 100) {
      // If staking but not fully optimized
      actions.push({
        title: t('optimizeReturns'),
        description: t('optimizeReturnsDesc'),
        onClick: () => navigate('/validators'),
        icon: faChartLine,
      })
    } else {
      // If fully optimized staking
      actions.push({
        title: t('getMoreInformation'),
        description: t('getMoreInformationDesc'),
        onClick: openResourcesModal,
        icon: faBookOpen,
      })
    }

    return actions
  }

  const nextSteps = getNextSteps()
  const milestones = getMilestones()
  const quickActions = getQuickActions()

  return (
    <Wrapper>
      <CardHeader>
        <h4>{t('stakingProgress')}</h4>
      </CardHeader>

      {/* Progress Bar Section */}
      <ProgressContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-color-secondary)' }}>
            {t('completedSteps', {
              completed: progress.completedSteps,
              total: progress.totalSteps,
            })}
          </span>
          <span
            style={{ fontWeight: 'bold', color: 'var(--text-color-primary)' }}
          >
            {progress.percentage}%
          </span>
        </div>
        <ProgressBar>
          <div
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          />
        </ProgressBar>
      </ProgressContainer>

      {/* Checklist Section */}
      <SectionTitle>{t('stakingChecklist')}</SectionTitle>
      <ChecklistContainer>
        {nextSteps.map((step, index) => (
          <ChecklistItem
            key={index}
            className={step.completed ? 'completed' : ''}
          >
            <div className="icon">
              {step.completed ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="item-content">
              <div className="item-title">{step.title}</div>
              <div className="item-description">{step.description}</div>
              {step.supplementary && (
                <div className="item-supplementary">{step.supplementary}</div>
              )}
            </div>
          </ChecklistItem>
        ))}
      </ChecklistContainer>

      {/* Milestones Section - Only show if there are milestones */}
      {milestones.length > 0 && (
        <>
          <SectionTitle>{t('milestones')}</SectionTitle>
          {milestones.map((milestone, index) => (
            <MilestoneContainer key={index}>
              <div className="milestone-icon">
                <FontAwesomeIcon icon={faAward} />
              </div>
              <div className="milestone-content">
                <div className="milestone-title">{milestone.title}</div>
                <div className="milestone-description">
                  {milestone.description}
                </div>
              </div>
            </MilestoneContainer>
          ))}
        </>
      )}

      {/* What's Next Section */}
      <SectionTitle>{t('whatsNext')}</SectionTitle>
      <QuickActionsContainer>
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} onClick={action.onClick}>
            <FontAwesomeIcon icon={action.icon} />
            <strong>{action.title}</strong>
            <span>{action.description}</span>
          </QuickActionButton>
        ))}
      </QuickActionsContainer>
    </Wrapper>
  )
}
