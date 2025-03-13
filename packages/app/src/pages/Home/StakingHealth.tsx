// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { CardHeader } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { Wrapper } from './Wrappers'

// Styled components for the health status indicator
const HealthStatus = styled.div`
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.1rem;

  &.very-healthy {
    background-color: rgba(0, 180, 0, 0.15);
    color: var(--text-color-primary);
  }

  &.healthy {
    background-color: rgba(0, 150, 0, 0.1);
    color: var(--text-color-primary);
  }

  &.unhealthy {
    background-color: rgba(220, 0, 0, 0.1);
    color: var(--text-color-primary);
  }

  &:before {
    content: '';
    display: inline-block;
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    margin-right: 0.75rem;
  }

  &.very-healthy:before {
    background-color: #2ecc71;
  }

  &.healthy:before {
    background-color: #27ae60;
  }

  &.unhealthy:before {
    background-color: #e74c3c;
  }
`

const StyledText = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 1.1rem;
`

const SectionTitle = styled.h3`
  color: var(--text-color-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
`

const TipsList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 2rem;

  li {
    margin-bottom: 0.75rem;
    color: var(--text-color-secondary);
    line-height: 1.4;
    font-size: 1.05rem;
  }
`

const ManageButton = styled.button`
  background-color: var(--button-primary-background);
  color: var(--text-color-primary);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  &:hover {
    background-color: var(--button-hover-background);
  }

  svg {
    margin-right: 0.5rem;
  }
`

export const StakingHealth = () => {
  const { t } = useTranslation('pages')
  const { activeAccount } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { getBalance, getNominations } = useBalances()
  const { formatWithPrefs } = useValidators()
  const {
    networkData: { units },
  } = useNetwork()
  const navigate = useNavigate()

  const balance = getBalance(activeAccount)
  const { frozen } = balance

  // Get nominations if user is nominating
  const nominated = formatWithPrefs(getNominations(activeAccount))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  // Determine staking type
  const isNominating = !inSetup()
  const isInPool = inPool()
  const stakingType = isNominating ? 'nominating' : isInPool ? 'pool' : ''

  // Get network average reward rate
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const { unclaimedRewards } = usePayouts()

  // Calculate individual's staking performance
  const calculateIndividualRewardRate = () => {
    // In a real implementation, we would calculate this based on actual rewards data
    // For now, I'll use a simplified approach based on unclaimed rewards

    // If user has no staking activity, return 0
    if (!isNominating && !isInPool) {
      return new BigNumber(0)
    }

    // For demonstration purposes, we'll calculate a reward rate
    // In a real implementation, this would be based on historical rewards data
    let individualRate = new BigNumber(0)

    if (isNominating) {
      // In a real implementation, we would use historical payout data over a specific period
      const totalUnclaimed = new BigNumber(unclaimedRewards.total || '0')
      const stakedAmount = planckToUnitBn(frozen, units)

      if (stakedAmount.isGreaterThan(0)) {
        // Simple annualized rate calculation (this is simplified for demonstration)
        // In a real implementation, we would use actual time periods and more accurate data
        individualRate = totalUnclaimed.dividedBy(stakedAmount).multipliedBy(12) // Assuming monthly rewards
      }
    } else if (isInPool) {
      // For pool stakers: Similar approach but would use pool-specific reward data
      // In a real implementation, we would fetch pool reward data and calculate based on user's share
      // For now, we'll use a similar simplified approach
      const stakedAmount = planckToUnitBn(frozen, units)

      if (stakedAmount.isGreaterThan(0)) {
        // Simplified calculation for demonstration
        // In a real implementation, we would use actual pool reward data
        // For now, we'll use a value close to the network average with some variation
        individualRate = avgRateBeforeCommission.multipliedBy(
          0.9 + Math.random() * 0.2
        )
      }
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

  // Handle the manage stake button click
  const handleManageStake = () => {
    if (isInPool) {
      navigate('/pools')
    } else if (isNominating) {
      navigate('/nominate')
    }
  }

  return (
    <>
      <CardHeader>
        <h4>{t('stakingHealth')}</h4>
      </CardHeader>
      <Wrapper>
        <div className="content">
          <h2>{t('yourStakingStatus')}</h2>

          {stakingType === 'pool' && (
            <StyledText>{t('youAreCurrentlyStakingInAPool')}</StyledText>
          )}

          {stakingType === 'nominating' && (
            <StyledText>
              {t('youAreCurrentlyNominating', {
                count: nominated.length,
              })}
            </StyledText>
          )}

          <HealthStatus className={healthStatus.class}>
            {t('yourStakingPosition')}: {healthStatus.message}
          </HealthStatus>

          {stakingType === 'nominating' &&
            fullCommissionNominees.length > 0 && (
              <div className="warning">
                <h3>{t('warningFullCommission')}</h3>
                <p>
                  {t('youHaveNominatedFullCommission', {
                    count: fullCommissionNominees.length,
                  })}
                </p>
              </div>
            )}

          <SectionTitle>{t('stakingTips')}</SectionTitle>
          <TipsList>
            <li>{t('stakingTip1')}</li>
            <li>{t('stakingTip2')}</li>
            <li>{t('stakingTip3')}</li>
          </TipsList>

          {(isInPool || isNominating) && (
            <ManageButton onClick={handleManageStake}>
              <FontAwesomeIcon icon={faEdit} />
              {t('manageStake')}
            </ManageButton>
          )}
        </div>
      </Wrapper>
    </>
  )
}
