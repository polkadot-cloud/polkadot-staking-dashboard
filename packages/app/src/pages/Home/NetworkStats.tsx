// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
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

export const NetworkStats = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const { stakingMetrics, networkMetrics } = useApi()

  // Get token icon
  const Token = getChainIcons(network).token

  // Format percentage
  const formatPercent = (value: number) => `${value.toFixed(2)}%`

  // Format large numbers with commas
  const formatNumber = (num: number) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Get active validators count
  const activeValidators = stakingMetrics?.validatorCount?.toString() || '0'

  // Calculate percentage of supply staked
  const supplyStaked =
    stakingMetrics?.totalStaked && networkMetrics?.totalIssuance
      ? stakingMetrics.totalStaked
          .multipliedBy(100)
          .dividedBy(networkMetrics.totalIssuance)
          .toNumber()
      : 0

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
              <div className="stat-value">
                {formatPercent(avgRateBeforeCommission.toNumber())}
              </div>
              <div className="stat-label">{t('averageApy')}</div>
            </div>
          </StatItem>

          <StatItem>
            <div className="stat-icon">
              <i className="fa fa-users"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {formatNumber(Number(activeValidators))}
              </div>
              <div className="stat-label">{t('activeValidators')}</div>
            </div>
          </StatItem>

          <StatItem>
            <div className="stat-icon">
              <i className="fa fa-chart-pie"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatPercent(supplyStaked)}</div>
              <div className="stat-label">{t('supplyStaked')}</div>
            </div>
          </StatItem>
        </StatsContainer>
      </NetworkStatsWrapper>
    </>
  )
}
