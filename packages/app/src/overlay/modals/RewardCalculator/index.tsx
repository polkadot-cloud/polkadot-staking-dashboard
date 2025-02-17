// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { FiatValue } from 'library/FiatValue'
import { Title } from 'library/Modal/Title'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, CardLabel, Separator } from 'ui-core/base'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ContentWrapper } from '../Networks/Wrapper'

const DEFAULT_MANUAL_STAKE = 200

export const RewardCalculator = () => {
  const { t } = useTranslation()
  const {
    networkData: {
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { config } = useOverlay().modal
  const { getAverageRewardRate } = useAverageRewardRate()
  const { currency } = config.options
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  const [manualStake, setManualStake] = useState<number>(DEFAULT_MANUAL_STAKE)

  const annualReward = manualStake * (rewardRate / 100) || 0
  const monthlyReward = annualReward / 12 || 0
  const dailyReward = annualReward / 365 || 0

  return (
    <>
      <Title title="Reward Calculator" />
      <Padding>
        <ContentWrapper>
          <Padding>
            <label htmlFor="manual-stake">
              {t('rewards.enterStakeAmount', { ns: 'pages' })} ({unit}):
            </label>
            <input
              id="manual-stake"
              type="number"
              step="0.01"
              value={manualStake ?? ''}
              onChange={(e) => setManualStake(Number(e.target.value) || 0)}
              placeholder={t('rewards.stakePlaceholder', { ns: 'pages' })}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                border: '1px solid var(--border-primary-color)',
                borderRadius: '0.5rem',
              }}
            />
            <Separator />
            <CardHeader>
              <h4>{t('rewards.daily', { ns: 'pages' })}</h4>
              <h2>
                <Token />
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(dailyReward).toFormat(),
                    2
                  )}
                  zeroDecimals={2}
                />
                <CardLabel>
                  <FiatValue tokenBalance={dailyReward} currency={currency} />
                </CardLabel>
              </h2>
            </CardHeader>
            <Separator />
            <CardHeader>
              <h4>{t('rewards.monthly', { ns: 'pages' })}</h4>
              <h2>
                <Token />
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(monthlyReward).toFormat(),
                    2
                  )}
                  zeroDecimals={2}
                />
                <CardLabel>
                  <FiatValue tokenBalance={monthlyReward} currency={currency} />
                </CardLabel>
              </h2>
            </CardHeader>
            <Separator />
            <CardHeader>
              <h4>{t('rewards.annual', { ns: 'pages' })}</h4>
              <h2>
                <Token />
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(annualReward).toFormat(),
                    2
                  )}
                  zeroDecimals={2}
                />
                <CardLabel>
                  <FiatValue tokenBalance={annualReward} currency={currency} />
                </CardLabel>
              </h2>
            </CardHeader>
          </Padding>
        </ContentWrapper>
      </Padding>
    </>
  )
}
