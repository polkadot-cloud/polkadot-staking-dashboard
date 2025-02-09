// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTokenPrices } from 'contexts/TokenPrice'
import { AnimatePresence, motion } from 'framer-motion'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { CardWrapper } from 'library/Card/Wrappers'
import { Text } from 'library/StatCards/Text'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { CardHeader, PageRow, StatRow } from 'ui-core/base'
import { RewardText, RewardsGrid } from '../Wrappers'

export const Active = () => {
  const { t } = useTranslation('pages')
  const { inPool } = useActivePool()
  const { networkData } = useNetwork()
  const { price: dotPrice } = useTokenPrices()
  const { activeAccount } = useActiveAccounts()
  const { getLedger, getPoolMembership } = useBalances()
  const { getAverageRewardRate } = useAverageRewardRate()
  const [manualStake, setManualStake] = useState<number | null>(null)
  const [isCustomStake, setIsCustomStake] = useState(false)

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

  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  const currentStake =
    isCustomStake && manualStake !== null
      ? manualStake
      : Number(getCurrentStake())
  const annualReward = currentStake * (rewardRate / 100) || 0
  const monthlyReward = annualReward / 12 || 0
  const dailyReward = annualReward / 365 || 0

  const handleToggleStake = () => {
    if (isCustomStake) {
      setManualStake(null)
    }
    setIsCustomStake(!isCustomStake)
  }

  return (
    <>
      <StatRow>
        <RewardText>
          <Text
            label={t('rewards.averageRewardRate')}
            value={`${rewardRate.toFixed(2)}%`}
            helpKey="Average Reward Rate"
          />
        </RewardText>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <Text
            label={
              isCustomStake
                ? t('rewards.customBalance')
                : t('rewards.currentStakedBalance')
            }
            value={`${currentStake.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${networkData.api.unit}`}
            helpKey={isCustomStake ? 'Custom Balance' : 'Your Balance'}
          />
          <ButtonPrimary
            text={
              isCustomStake
                ? t('rewards.useConnectedWallet')
                : t('rewards.useCustomAmount')
            }
            onClick={handleToggleStake}
            style={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
          />
        </div>
      </StatRow>

      <AnimatePresence>
        {isCustomStake && (
          <PageRow>
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              style={{ overflow: 'hidden' }}
            >
              <CardWrapper>
                <CardHeader>
                  <h4>{t('rewards.adjustStake')}</h4>
                </CardHeader>

                <div style={{ padding: '1rem' }}>
                  <label htmlFor="manual-stake">
                    {t('rewards.enterStakeAmount')} ({networkData.api.unit}):
                  </label>
                  <input
                    id="manual-stake"
                    type="number"
                    step="0.01"
                    value={manualStake ?? ''}
                    onChange={(e) =>
                      setManualStake(Number(e.target.value) || null)
                    }
                    placeholder={t('rewards.stakePlaceholder')}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      border: '1px solid var(--border-primary-color)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </CardWrapper>
            </motion.div>
          </PageRow>
        )}
      </AnimatePresence>

      <PageRow>
        <CardWrapper>
          <CardHeader>
            <h4>{t('rewards.projectedRewards')}</h4>
          </CardHeader>

          <RewardsGrid>
            <div className="header">
              <span>{t('rewards.period')}</span>
              <span>{networkData.api.unit}</span>
              <span>USDT</span>
            </div>

            <div className="reward-row">
              <span>{t('rewards.daily')}</span>
              <span>
                {dailyReward.toLocaleString('en-US', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </span>
              <span>
                $
                {(dailyReward * dotPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="reward-row">
              <span>{t('rewards.monthly')}</span>
              <span>
                {monthlyReward.toLocaleString('en-US', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </span>
              <span>
                $
                {(monthlyReward * dotPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="reward-row">
              <span>{t('rewards.annual')}</span>
              <span>
                {annualReward.toLocaleString('en-US', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </span>
              <span>
                $
                {(annualReward * dotPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </RewardsGrid>
        </CardWrapper>
      </PageRow>
    </>
  )
}
