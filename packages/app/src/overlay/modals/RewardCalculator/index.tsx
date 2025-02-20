// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { FiatValue } from 'library/FiatValue'
import { Title } from 'library/Modal/Title'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, CardLabel, Separator } from 'ui-core/base'
import { TokenInput } from 'ui-core/input'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ContentWrapper } from '../Networks/Wrapper'

const DEFAULT_TOKEN_INPUT = 100

export const RewardCalculator = () => {
  const { t } = useTranslation()
  const {
    networkData: {
      unit,
      units,
      brand: { token: Token },
    },
  } = useNetwork()
  const { config } = useOverlay().modal
  const { getAverageRewardRate } = useAverageRewardRate()
  const { currency } = config.options
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  const [manualStake, setManualStake] = useState<number>(DEFAULT_TOKEN_INPUT)

  const annualReward = manualStake * (rewardRate / 100) || 0
  const monthlyReward = annualReward / 12 || 0
  const dailyReward = annualReward / 365 || 0

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setManualStake(Number(e.target.value || 0))
  }

  return (
    <>
      <Title
        title={t('rewards.rewardCalculator', { ns: 'pages' })}
        style={{ paddingLeft: '0.5rem' }}
      />
      <Padding horizontalOnly>
        <ContentWrapper>
          <h4>
            Enter a DOT amount to stake and calculate the potential rewards.
          </h4>
          <TokenInput
            id="reward-calc-token-input"
            label={`${t('rewards.unitAmount', { ns: 'pages', unit })}:`}
            onChange={onChange}
            placeholder={t('rewards.stakePlaceholder', { ns: 'pages' })}
            value={manualStake || ''}
            marginY
          />
          <Separator />
          <CardHeader>
            <h4>{t('rewards.daily', { ns: 'pages' })}</h4>
            <h2>
              <Token />
              <Odometer
                value={minDecimalPlaces(
                  new BigNumber(dailyReward).toFormat(units),
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
                  new BigNumber(monthlyReward).toFormat(units),
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
                  new BigNumber(annualReward).toFormat(units),
                  2
                )}
                zeroDecimals={2}
              />
              <CardLabel>
                <FiatValue tokenBalance={annualReward} currency={currency} />
              </CardLabel>
            </h2>
          </CardHeader>
          <Separator transparent />
        </ContentWrapper>
      </Padding>
    </>
  )
}
