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

  // Calculate staking progress (example logic)
  const calculateProgress = () =>
    // For the enhanced version, we'll always show 100% completion
    // to indicate all steps are completed
    ({
      percentage: 100,
      completedSteps: 4,
      totalSteps: 4,
    })

  const progress = calculateProgress()

  // Determine milestones (example logic)
  const getMilestones = () => {
    const milestones: MilestoneItem[] = []

    // Always show the first stake milestone
    milestones.push({
      title: t('milestoneFirstStake'),
      description: t('milestoneFirstStakeDesc'),
    })

    return milestones
  }

  // Get next steps based on current progress
  const getNextSteps = () => {
    const steps: StepItem[] = []

    // Always show these completed steps
    steps.push({
      title: t('connectWallet'),
      description: t('walletConnected'),
      completed: true,
    })

    steps.push({
      title: t('chooseStakingMethod'),
      description: t('directNominationSelected'),
      completed: true,
    })

    // Add the optimize staking step
    steps.push({
      title: t('optimizeStaking'),
      description: t('optimizeStakingDesc'),
      completed: true,
    })

    return steps
  }

  // Get quick actions for the What's Next section
  const getQuickActions = () => {
    const actions: QuickAction[] = []

    // Add the two specific buttons required
    actions.push({
      title: t('learnMoreAboutStaking'),
      description: t('learnMoreAboutStakingDesc'),
      onClick: () => {
        // Since we don't have a Resources modal, we'll navigate to an external resource
        window.open(
          'https://wiki.polkadot.network/docs/learn-staking',
          '_blank'
        )
      },
      icon: faBookOpen,
    })

    actions.push({
      title: t('trackRewards'),
      description: t('trackRewardsDesc'),
      onClick: () => navigate('/rewards'),
      icon: faChartLine,
    })

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
            </div>
          </ChecklistItem>
        ))}
      </ChecklistContainer>

      {/* Milestones Section */}
      <SectionTitle>{t('milestones')}</SectionTitle>
      {milestones.map((milestone, index) => (
        <MilestoneContainer key={index}>
          <div className="milestone-icon">
            <FontAwesomeIcon icon={faAward} />
          </div>
          <div className="milestone-content">
            <div className="milestone-title">{milestone.title}</div>
            <div className="milestone-description">{milestone.description}</div>
          </div>
        </MilestoneContainer>
      ))}

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
