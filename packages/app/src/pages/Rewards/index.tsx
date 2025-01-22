// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { CardWrapper } from 'library/Card/Wrappers'
import { StatBoxList } from 'library/StatBoxList'
import { Text } from 'library/StatBoxList/Text'
import { formatTokenPrice, useTokenPrice } from 'plugin-staking-api'
import { useTranslation } from 'react-i18next'
import { CardHeader, PageRow, PageTitle } from 'ui-core/base'
import { HistoryPlaceholder, RewardText, RewardsGrid } from './Wrappers'

export const Rewards = () => {
  const { t } = useTranslation('pages')
  const { activeAccount } = useActiveAccounts()
  const { inPool } = useActivePool()
  const { getLedger, getPoolMembership } = useBalances()
  const { networkData } = useNetwork()
  const { getAverageRewardRate } = useAverageRewardRate()

  // Get current stake
  const getCurrentStake = () => {
    if (!activeAccount) {
      return '0'
    }

    let rawAmount = '0'
    if (inPool()) {
      const membership = getPoolMembership(activeAccount)
      rawAmount = membership?.points ?? '0'
    } else {
      rawAmount = getLedger({ stash: activeAccount }).active.toString() ?? '0'
    }
    return planckToUnit(rawAmount, networkData.units)
  }

  // Get token price
  const { loading, error, data } = useTokenPrice({
    ticker: `${networkData.api.unit}USDT`,
  })
  const { price: dotPrice } = formatTokenPrice(loading, error, data)

  // Get reward rate
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  // Calculate rewards
  const currentStake = Number(getCurrentStake())
  const annualReward = currentStake * (rewardRate / 100)
  const monthlyReward = annualReward / 12
  const dailyReward = annualReward / 365

  return (
    <>
      <PageTitle title={t('rewards.rewardsCalculator')} />

      <StatBoxList>
        <Text
          label={t('Your Current Staked Balance')}
          value={`${currentStake.toFixed(2)} ${networkData.api.unit}`}
          helpKey="Your Balance"
        />
        <RewardText>
          <Text
            label={t('Average Reward Rate')}
            value={`${rewardRate.toFixed(2)}%`}
            helpKey="Average Reward Rate"
          />
        </RewardText>
      </StatBoxList>

      <PageRow>
        <CardWrapper>
          <CardHeader>
            <h4>{t('Your Projected Rewards')}</h4>
          </CardHeader>

          <RewardsGrid>
            <div className="header">
              <span>Period</span>
              <span>{networkData.api.unit}</span>
              <span>USDT</span>
            </div>

            <div className="reward-row">
              <span>Daily</span>
              <span>{dailyReward.toFixed(3)}</span>
              <span>${(dailyReward * dotPrice).toFixed(2)}</span>
            </div>

            <div className="reward-row">
              <span>Monthly</span>
              <span>{monthlyReward.toFixed(3)}</span>
              <span>${(monthlyReward * dotPrice).toFixed(2)}</span>
            </div>

            <div className="reward-row">
              <span>Annual</span>
              <span>{annualReward.toFixed(3)}</span>
              <span>${(annualReward * dotPrice).toFixed(2)}</span>
            </div>
          </RewardsGrid>
        </CardWrapper>
      </PageRow>

      <PageRow>
        <CardWrapper>
          <CardHeader>
            <h4>{t('Your Payout History')}</h4>
          </CardHeader>

          <HistoryPlaceholder>
            <p>Your payout history will appear here</p>
            <p className="secondary">Showing the last 30 days of rewards</p>
          </HistoryPlaceholder>
        </CardWrapper>
      </PageRow>
    </>
  )
}
