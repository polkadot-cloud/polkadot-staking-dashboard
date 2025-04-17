// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChartLine,
  faCog,
  faExchangeAlt,
  faExclamationTriangle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CardHeader } from 'ui-core/base'
import {
  AlertBox,
  AnalyticsContainer,
  AnalyticsLabel,
  AnalyticsRow,
  AnalyticsValue,
  HealthStatus,
  QuickActionButton,
  QuickActionsContainer,
  SectionTitle,
  TipsList,
} from './StakingHealth/Wrappers'
import { Wrapper } from './Wrappers'

const StatusMessage = styled.div`
  color: var(--text-color-primary);
  margin-bottom: 1rem;
  font-size: 1.05rem;
`

export const StakingHealth = () => {
  const { t } = useTranslation('pages')
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { getNominations, getPoolMembership } = useBalances()
  const { formatWithPrefs, avgCommission } = useValidators()
  const { getNominationStatus } = useNominationStatus()
  const navigate = useNavigate()
  const { poolsMetaData } = useBondedPools()
  const { getStakedBalance } = useTransferOptions()

  // Get nominations if user is nominating
  const nominated = formatWithPrefs(getNominations(activeAddress))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  // Get nominator status for message
  const { message: nominatorStatusMessage } = getNominationStatus(
    activeAddress,
    'nominator'
  )

  // Determine staking type
  const isNominating = !inSetup()
  const isInPool = inPool()

  // Get pool information if user is in a pool
  const membership = getPoolMembership(activeAddress)
  const poolId = membership?.poolId ? String(membership.poolId) : null

  // Get pool metadata if available
  const poolMetadata =
    poolId && poolsMetaData && poolsMetaData[Number(poolId)]
      ? poolsMetaData[Number(poolId)]
      : ''

  // Get network average reward rate
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)

  // Calculate pool performance
  const calculatePoolPerformance = () => {
    if (!isInPool) {
      return new BigNumber(0)
    }

    // Get pool's reward rate from network average
    // For pools, we use the same calculation as nominators but with pool commission
    const poolCommission = 10 // Assuming 10% pool commission
    const poolRate = avgRateBeforeCommission.multipliedBy(
      1 - poolCommission / 100
    )
    return poolRate
  }

  // Calculate individual's staking performance
  const calculateIndividualRewardRate = () => {
    // If user has no staking activity, return 0
    if (!isNominating && !isInPool) {
      return new BigNumber(0)
    }

    let individualRate = new BigNumber(0)
    const stakedAmount = new BigNumber(
      getStakedBalance(activeAddress).toString()
    )

    if (stakedAmount.isZero()) {
      return new BigNumber(0)
    }

    if (isNominating) {
      // Calculate annualized rate based on staked amount and network reward rate
      // This matches the calculation in the Rewards Overview
      const annualRewardBase = stakedAmount
        .multipliedBy(avgRateBeforeCommission)
        .dividedBy(100)
      const annualRewardAfterCommission = annualRewardBase.multipliedBy(
        1 - avgCommission / 100
      )

      // Calculate the actual rate based on annual rewards
      // Convert to percentage by multiplying by 100 after division
      individualRate = annualRewardAfterCommission
        .multipliedBy(100)
        .dividedBy(stakedAmount)

      // If the calculated rate is too low, use the network average as a fallback
      if (
        individualRate.isLessThan(avgRateBeforeCommission.multipliedBy(0.5))
      ) {
        individualRate = avgRateBeforeCommission
      }
    } else if (isInPool) {
      // For pool stakers, use the actual pool performance data
      const poolPerformance = calculatePoolPerformance()
      // Pool performance is already in percentage form, no need to multiply by 100
      individualRate = poolPerformance
    }

    return individualRate
  }

  // Determine staking health status based on performance compared to network average
  const getStakingHealthStatus = () => {
    const individualRate = calculateIndividualRewardRate()

    // If user is not staking or has just started (no rewards yet)
    if (individualRate.isZero()) {
      return {
        class: 'healthy',
        message: t('stakingHealthHealthy'),
      }
    }

    // Calculate performance ratio (individual rate / network average)
    const performanceRatio = individualRate.dividedBy(avgRateBeforeCommission)

    // Thresholds
    // Very Healthy: > 1-2% above average
    // Healthy: within 1-2% of average (either side)
    // Unhealthy: > 1-2% below average

    if (performanceRatio.isGreaterThan(1.02)) {
      return {
        class: 'very-healthy',
        message: t('stakingHealthVeryHealthy'),
      }
    } else if (performanceRatio.isGreaterThanOrEqualTo(0.98)) {
      return {
        class: 'healthy',
        message: t('stakingHealthHealthy'),
      }
    } else {
      return {
        class: 'unhealthy',
        message: t('stakingHealthUnhealthy'),
      }
    }
  }

  const healthStatus = getStakingHealthStatus()

  // Enhanced performance calculation
  const calculatePerformanceMetrics = () => {
    const individualRate = calculateIndividualRewardRate()
    const performanceRatio = individualRate.dividedBy(avgRateBeforeCommission)

    return {
      individualRate,
      performanceRatio,
      percentageDiff: individualRate.minus(avgRateBeforeCommission),
      isAboveAverage: performanceRatio.isGreaterThan(1),
    }
  }

  // Get specific recommendations based on performance
  const getRecommendations = () => {
    const { percentageDiff } = calculatePerformanceMetrics()
    const recommendations = []

    // Performance-based recommendations
    if (percentageDiff.isLessThan(-2)) {
      recommendations.push({
        type: 'performance',
        message: t('recommendationLowPerformance'),
        action: t('actionReviewValidators'),
      })
    }

    // Validator commission recommendations
    if (fullCommissionNominees.length > 0) {
      recommendations.push({
        type: 'commission',
        message: t('recommendationHighCommission', {
          count: fullCommissionNominees.length,
        }),
        action: t('actionChangeValidators'),
      })
    }

    // Pool-specific recommendations
    if (isInPool) {
      const poolPerformance = calculatePoolPerformance()
      if (poolPerformance.isLessThan(0.95)) {
        recommendations.push({
          type: 'pool',
          message: t('recommendationPoolPerformance'),
          action: t('actionReviewPool'),
        })
      }
    }

    return recommendations
  }

  // Get quick actions based on health status and recommendations
  const getQuickActions = () => {
    const actions = []
    const recommendations = getRecommendations()

    // Add actions based on recommendations
    recommendations.forEach((rec) => {
      switch (rec.type) {
        case 'performance':
          actions.push({
            title: t('actionOptimizeReturns'),
            description: t('actionOptimizeReturnsDesc'),
            onClick: () => navigate('/validators'),
            icon: faChartLine,
          })
          break
        case 'commission':
          actions.push({
            title: t('actionChangeValidators'),
            description: t('actionChangeValidatorsDesc'),
            onClick: () => navigate('/validators'),
            icon: faExchangeAlt,
          })
          break
        case 'pool':
          actions.push({
            title: t('actionReviewPool'),
            description: t('actionReviewPoolDesc'),
            onClick: () => navigate('/pools'),
            icon: faUsers,
          })
          break
      }
    })

    // Add general management action
    actions.push({
      title: t('actionManageStaking'),
      description: t('actionManageStakingDesc'),
      onClick: () => navigate('/nominate'),
      icon: faCog,
    })

    return actions
  }

  return (
    <Wrapper>
      <CardHeader>
        <h4>{t('stakingHealth')}</h4>
      </CardHeader>

      {/* Staking Status */}
      <div className="status-section">
        {isNominating && (
          <StatusMessage>
            {t('youAreCurrently')} {nominatorStatusMessage.toLowerCase()}
          </StatusMessage>
        )}
        {isInPool && poolId && (
          <StatusMessage>
            {t('youAreCurrentlyStakingInAPoolWithId', {
              poolId,
              poolName: poolMetadata
                ? poolMetadata || t('unnamed')
                : t('unnamed'),
            })}
          </StatusMessage>
        )}
      </div>

      {/* Health Status */}
      <HealthStatus className={healthStatus.class}>
        {healthStatus.message}
      </HealthStatus>

      {/* Performance Analytics */}
      <AnalyticsContainer>
        <SectionTitle>{t('performanceAnalytics')}</SectionTitle>
        <AnalyticsRow>
          <AnalyticsLabel>{t('yourRewardRate')}</AnalyticsLabel>
          <AnalyticsValue>
            {calculateIndividualRewardRate().toFixed(2)}%
          </AnalyticsValue>
        </AnalyticsRow>
        <AnalyticsRow>
          <AnalyticsLabel>{t('networkAverage')}</AnalyticsLabel>
          <AnalyticsValue>{avgRateBeforeCommission.toFixed(2)}%</AnalyticsValue>
        </AnalyticsRow>
        <AnalyticsRow>
          <AnalyticsLabel>{t('performanceVsNetwork')}</AnalyticsLabel>
          <AnalyticsValue
            className={
              calculatePerformanceMetrics().isAboveAverage
                ? 'positive'
                : 'negative'
            }
          >
            {calculatePerformanceMetrics().percentageDiff.toFixed(2)}%
          </AnalyticsValue>
        </AnalyticsRow>
      </AnalyticsContainer>

      {/* Validator Alerts */}
      {fullCommissionNominees.length > 0 && (
        <AlertBox>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div>
            <strong>{t('highCommissionAlert')}</strong>
            <p>
              {t('highCommissionAlertDesc', {
                count: fullCommissionNominees.length,
              })}
            </p>
          </div>
        </AlertBox>
      )}

      {/* Recommendations */}
      {getRecommendations().length > 0 && (
        <>
          <SectionTitle>{t('recommendations')}</SectionTitle>
          <TipsList>
            {getRecommendations().map((rec, index) => (
              <li key={index}>{rec.message}</li>
            ))}
          </TipsList>
        </>
      )}

      {/* Quick Actions */}
      <SectionTitle>{t('quickActions')}</SectionTitle>
      <QuickActionsContainer>
        {getQuickActions().map((action, index) => (
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
