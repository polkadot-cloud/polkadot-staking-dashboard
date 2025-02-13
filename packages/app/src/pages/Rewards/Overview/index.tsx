// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useTokenPrices } from 'contexts/TokenPrice'
import { useTransferOptions } from 'contexts/TransferOptions'
import { AnimatePresence } from 'framer-motion'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { CardWrapper } from 'library/Card/Wrappers'
import { AverageRewardRate } from 'pages/Overview/Stats/AveragelRewardRate'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, PageRow, StatRow } from 'ui-core/base'
import { RewardCalculator } from '../Stats/RewardCalculator'
import { StakedBalance } from '../Stats/StakedBalance'
import { RewardsGrid } from '../Wrappers'
import type { PageProps } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Overview = (_: PageProps) => {
  const { t } = useTranslation('pages')
  const { networkData } = useNetwork()
  const { price: dotPrice } = useTokenPrices()
  const { activeAccount } = useActiveAccounts()
  const { getStakedBalance } = useTransferOptions()
  const { getAverageRewardRate } = useAverageRewardRate()
  const [manualStake, setManualStake] = useState<number | null>(null)
  const [isCustomStake, setIsCustomStake] = useState(false)

  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  const currentStake =
    isCustomStake && manualStake !== null
      ? manualStake
      : getStakedBalance(activeAccount).toNumber()

  const annualReward = currentStake * (rewardRate / 100) || 0
  const monthlyReward = annualReward / 12 || 0
  const dailyReward = annualReward / 365 || 0

  const handleToggleStake = () => {
    if (isCustomStake) {
      setManualStake(null)
    }
    setIsCustomStake(!isCustomStake)
  }

  const currency = 'USDT'
  const symbol = '$'

  return (
    <>
      <StatRow>
        <AverageRewardRate />
        <StakedBalance isCustomStake={isCustomStake} />
        <RewardCalculator
          isCustomStake={isCustomStake}
          onClick={handleToggleStake}
        />
      </StatRow>

      <AnimatePresence>
        {isCustomStake && (
          <PageRow>
            <div>
              <CardWrapper>
                <CardHeader>
                  <h3>{t('rewards.adjustStake')}</h3>
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
                      borderRadius: '0.5rem',
                    }}
                  />
                </div>
              </CardWrapper>
            </div>
          </PageRow>
        )}
      </AnimatePresence>

      <PageRow>
        <CardWrapper>
          <CardHeader>
            <h3>{t('rewards.projectedRewards')}</h3>
          </CardHeader>

          <RewardsGrid>
            <div className="row head">
              <div>
                <h4>{t('rewards.period')}</h4>
              </div>
              <div>
                <h4>{networkData.unit}</h4>
              </div>
              <div>
                <h4>{currency}</h4>
              </div>
            </div>

            <div className="row body">
              <div>
                <h3>{t('rewards.daily')}</h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {dailyReward.toLocaleString('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {symbol}
                  {(dailyReward * dotPrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </div>

            <div className="row body">
              <div>
                <h3>{t('rewards.monthly')}</h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {monthlyReward.toLocaleString('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {symbol}
                  {(monthlyReward * dotPrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </div>

            <div className="row body">
              <div>
                <h3>{t('rewards.annual')}</h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {annualReward.toLocaleString('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </h3>
              </div>
              <div>
                <h3>
                  <FontAwesomeIcon icon={faCaretUp} />
                  {symbol}
                  {(annualReward * dotPrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </div>
          </RewardsGrid>
        </CardWrapper>
      </PageRow>
    </>
  )
}
