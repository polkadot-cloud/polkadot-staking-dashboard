// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { CardHeader } from 'ui-core/base'

// Styled components for the network stats widget
const NetworkStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  gap: 1rem;
`

const StatItem = styled.div`
  display: flex;
  align-items: center;

  .stat-icon {
    margin-right: 1rem;
    display: flex;
    align-items: center;
    width: 1.5rem;
    color: var(--text-color-secondary);
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color-primary);
      margin-bottom: 0.1rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }
  }
`

const NetworkStatsInner = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const {
    stakingMetrics: { lastTotalStake, totalIssuance, validatorCount },
  } = useApi()
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)

  // Get network-specific data with useMemo
  const { Token, units } = useMemo(() => {
    const chainData = getStakingChainData(network)
    const chainIcons = getChainIcons(network)
    return {
      Token: chainIcons.token,
      units: chainData.units,
    }
  }, [network])

  // Memoize expensive calculations
  const { formattedSupplyStaked, formattedActiveValidators, formattedAvgRate } =
    useMemo(() => {
      // Format percentage
      const formatPercent = (value: number) => `${value.toFixed(2)}%`

      // Format large numbers with commas
      const formatNumber = (num: number) =>
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      // Calculate percentage of supply staked using correct fields and calculation
      const totalIssuanceUnit = new BigNumber(
        planckToUnit(totalIssuance, units)
      )
      const lastTotalStakeUnit = new BigNumber(
        planckToUnit(lastTotalStake, units)
      )

      const supplyStakedPercent =
        lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
          ? new BigNumber(0)
          : lastTotalStakeUnit.dividedBy(totalIssuanceUnit.multipliedBy(0.01))

      return {
        formattedSupplyStaked: formatPercent(supplyStakedPercent.toNumber()),
        formattedActiveValidators: formatNumber(
          Number(validatorCount?.toString() || '0')
        ),
        formattedAvgRate: formatPercent(avgRateBeforeCommission.toNumber()),
      }
    }, [
      lastTotalStake,
      totalIssuance,
      validatorCount,
      avgRateBeforeCommission,
      units,
    ])

  return (
    <>
      <CardHeader>
        <h4>{t('networkStats')}</h4>
      </CardHeader>
      <NetworkStatsWrapper>
        <StatsContainer>
          <StatItem>
            <div className="stat-icon">
              <Token />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formattedAvgRate}</div>
              <div className="stat-label">{t('averageApy')}</div>
            </div>
          </StatItem>

          <StatItem>
            <div className="stat-icon">
              <i className="fa fa-users"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formattedActiveValidators}</div>
              <div className="stat-label">{t('activeValidators')}</div>
            </div>
          </StatItem>

          <StatItem>
            <div className="stat-icon">
              <i className="fa fa-chart-pie"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formattedSupplyStaked}</div>
              <div className="stat-label">{t('supplyStaked')}</div>
            </div>
          </StatItem>
        </StatsContainer>
      </NetworkStatsWrapper>
    </>
  )
}

export const NetworkStats = memo(NetworkStatsInner)
