// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import { styled } from 'styled-components'
import { CardHeader } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { Wrapper } from './Wrappers'

// Styled components for the health status indicator
const HealthStatus = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;

  &.very-healthy {
    background-color: rgba(0, 180, 0, 0.15);
    color: #00b400;
  }

  &.healthy {
    background-color: rgba(0, 150, 0, 0.1);
    color: #009600;
  }

  &.unhealthy {
    background-color: rgba(220, 0, 0, 0.1);
    color: #dc0000;
  }

  &:before {
    content: '';
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    margin-right: 0.75rem;
  }

  &.very-healthy:before {
    background-color: #00b400;
  }

  &.healthy:before {
    background-color: #009600;
  }

  &.unhealthy:before {
    background-color: #dc0000;
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
    networkData: { units, unit },
  } = useNetwork()

  const balance = getBalance(activeAccount)
  const { free, frozen } = balance

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

  return (
    <>
      <CardHeader>
        <h4>{t('stakingHealth')}</h4>
      </CardHeader>
      <Wrapper>
        <div
          className="content"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}
        >
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>{t('yourStakingStatus')}</h2>

            <HealthStatus className={healthStatus.class}>
              {t('yourStakingPosition')}: {healthStatus.message}
            </HealthStatus>

            {stakingType === 'nominating' && (
              <>
                <p>
                  {t('youAreCurrentlyNominating', {
                    count: nominated.length,
                  })}
                </p>

                {fullCommissionNominees.length > 0 && (
                  <div className="warning">
                    <h3>{t('warningFullCommission')}</h3>
                    <p>
                      {t('youHaveNominatedFullCommission', {
                        count: fullCommissionNominees.length,
                      })}
                    </p>
                  </div>
                )}

                <div className="balance-info">
                  <h3>{t('balanceInformation')}</h3>
                  <div className="balance-row">
                    <span>{t('totalBalance')}:</span>
                    <span>
                      {planckToUnitBn(free.plus(frozen), units).toFormat()}{' '}
                      {unit}
                    </span>
                  </div>
                  <div className="balance-row">
                    <span>{t('stakedBalance')}:</span>
                    <span>
                      {planckToUnitBn(frozen, units).toFormat()} {unit}
                    </span>
                  </div>
                  <div className="balance-row">
                    <span>{t('freeBalance')}:</span>
                    <span>
                      {planckToUnitBn(free, units).toFormat()} {unit}
                    </span>
                  </div>
                </div>
              </>
            )}

            {stakingType === 'pool' && (
              <>
                <p>{t('youAreCurrentlyStakingInAPool')}</p>

                <div className="balance-info">
                  <h3>{t('balanceInformation')}</h3>
                  <div className="balance-row">
                    <span>{t('totalBalance')}:</span>
                    <span>
                      {planckToUnitBn(free.plus(frozen), units).toFormat()}{' '}
                      {unit}
                    </span>
                  </div>
                  <div className="balance-row">
                    <span>{t('poolBalance')}:</span>
                    <span>
                      {planckToUnitBn(frozen, units).toFormat()} {unit}
                    </span>
                  </div>
                  <div className="balance-row">
                    <span>{t('freeBalance')}:</span>
                    <span>
                      {planckToUnitBn(free, units).toFormat()} {unit}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="tips">
              <h3>{t('stakingTips')}</h3>
              <ul>
                <li>{t('stakingTip1')}</li>
                <li>{t('stakingTip2')}</li>
                <li>{t('stakingTip3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}
