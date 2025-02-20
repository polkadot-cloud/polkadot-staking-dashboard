// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { FiatValue } from 'library/FiatValue'
import { Title } from 'library/Modal/Title'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, Separator, TokenFiat } from 'ui-core/base'
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
  const { avgCommission } = useValidators()
  const { getAverageRewardRate } = useAverageRewardRate()

  const { currency } = config.options
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  // Store token amount to stake
  const [stakeAmount, setStakeAmount] = useState<number>(DEFAULT_TOKEN_INPUT)

  // Whether to show base or commission-adjusted rewards
  const [showAdjusted, setShowCommissionAdjusted] = useState<boolean>(false)

  const annualRewardBase = stakeAmount * (rewardRate / 100) || 0

  const annualRewardAfterCommission =
    annualRewardBase * (1 - avgCommission / 100)
  const monthlyRewardAfterCommission = annualRewardAfterCommission / 12
  const dailyRewardAfterCommission = annualRewardAfterCommission / 365

  const annualReward = showAdjusted
    ? annualRewardAfterCommission
    : annualRewardBase

  const monthlyReward = showAdjusted
    ? monthlyRewardAfterCommission
    : annualRewardBase / 12
  const dailyReward = showAdjusted
    ? dailyRewardAfterCommission
    : annualRewardBase / 365

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStakeAmount(Number(e.target.value || 0))
  }

  return (
    <div style={{ padding: '0 0.5rem' }}>
      <Title
        title={t('rewards.rewardCalculator', { ns: 'pages' })}
        style={{ paddingLeft: '0.5rem' }}
      />
      <Padding horizontalOnly>
        <ContentWrapper>
          <h4>{t('rewards.rewardCalcSubtitle', { ns: 'pages', unit })}</h4>
          <TokenInput
            id="reward-calc-token-input"
            label={`${t('rewards.unitAmount', { ns: 'pages', unit })}`}
            onChange={onChange}
            placeholder={t('rewards.stakePlaceholder', { ns: 'pages' })}
            value={stakeAmount || ''}
            marginY
          />{' '}
          <h3 style={{ padding: '0 0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowCommissionAdjusted(!showAdjusted)}
            >
              <FontAwesomeIcon
                icon={showAdjusted ? faToggleOn : faToggleOff}
                style={{
                  color: showAdjusted
                    ? 'var(--accent-color-primary)'
                    : 'var(--text-color-tertiary)',
                  marginRight: '0.8rem',
                }}
                transform={'grow-6'}
              />
              {t('rewards.deductAvgCommissionOf', {
                ns: 'pages',
                commission: avgCommission,
              })}
            </button>
          </h3>
          <Separator lg />
          <CardHeader>
            <h4>
              {t('rewards.daily', { ns: 'pages' })}{' '}
              {t('rewards', { ns: 'modals' })}
            </h4>
            <TokenFiat Token={<Token />}>
              <h1>
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(dailyReward).toFormat(units),
                    2
                  )}
                  zeroDecimals={2}
                />
              </h1>
              <h3>
                <FiatValue tokenBalance={dailyReward} currency={currency} />
              </h3>
            </TokenFiat>
          </CardHeader>
          <Separator lg />
          <CardHeader>
            <h4>
              {t('rewards.monthly', { ns: 'pages' })}{' '}
              {t('rewards', { ns: 'modals' })}
            </h4>
            <TokenFiat Token={<Token />}>
              <h1>
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(monthlyReward).toFormat(units),
                    2
                  )}
                  zeroDecimals={2}
                />
              </h1>
              <h3>
                <FiatValue tokenBalance={monthlyReward} currency={currency} />
              </h3>
            </TokenFiat>
          </CardHeader>
          <Separator lg />
          <CardHeader>
            <h4>
              {t('rewards.annual', { ns: 'pages' })}{' '}
              {t('rewards', { ns: 'modals' })}
            </h4>
            <TokenFiat Token={<Token />}>
              <h1>
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(annualReward).toFormat(units),
                    2
                  )}
                  zeroDecimals={2}
                />
              </h1>
              <h3>
                <FiatValue tokenBalance={annualReward} currency={currency} />
              </h3>
            </TokenFiat>
          </CardHeader>
          <Separator transparent style={{ marginTop: '3rem' }} />
        </ContentWrapper>
      </Padding>
    </div>
  )
}
