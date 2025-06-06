// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faCaretUp,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useTokenPrices } from 'contexts/TokenPrice'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { Balance } from 'library/Balance'
import { CardWrapper } from 'library/Card/Wrappers'
import { formatFiatCurrency } from 'locales/util'
import { AverageRewardRate } from 'pages/Overview/Stats/AverageRewardRate'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CardHeader,
  CardLabel,
  Page,
  RewardGrid,
  Separator,
  Stat,
} from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { RewardCalculator } from '../Stats/RewardCalculator'
import { RewardTrend } from '../Stats/RewardTrend'
import type { PayoutHistoryProps } from '../types'
import { RecentPayouts } from './RecentPayouts'

export const Overview = (props: PayoutHistoryProps) => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { currency } = useCurrency()
  const { pluginEnabled } = usePlugins()
  const { openModal } = useOverlay().modal
  const { avgCommission } = useValidators()
  const { activeAddress } = useActiveAccounts()
  const { price: tokenPrice } = useTokenPrices()
  const { getStakedBalance } = useTransferOptions()
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)

  const { unit } = getStakingChainData(network)
  const rewardRate = avgRateBeforeCommission.toNumber()
  const Token = getChainIcons(network).token

  // Whether to show base or commission-adjusted rewards
  const [showAdjusted, setShowCommissionAdjusted] = useState<boolean>(false)

  const currentStake = getStakedBalance(activeAddress).toNumber()
  const annualRewardBase = currentStake * (rewardRate / 100) || 0

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

  // Format the currency with user's locale and currency preference
  const formatLocalCurrency = (value: number) =>
    formatFiatCurrency(value, currency)

  return (
    <>
      <Stat.Row>
        <AverageRewardRate />
        {pluginEnabled('staking_api') && <RewardTrend />}
        <RewardCalculator
          onClick={() => {
            openModal({
              key: 'RewardCalculator',
              size: 'xs',
              options: {
                currency,
              },
            })
          }}
        />
      </Stat.Row>
      <Page.Row>
        <CardWrapper>
          <RecentPayouts {...props} />
        </CardWrapper>
      </Page.Row>
      {pluginEnabled('staking_api') && (
        <Page.Row>
          <CardWrapper>
            <CardHeader>
              <h3>{t('projectedRewards')}</h3>
            </CardHeader>
            <Separator style={{ margin: '0 0 1.5rem 0', border: 0 }} />
            <CardHeader>
              <h4>{t('stakedBalance')}</h4>
              <h2>
                <Token />
                <Odometer
                  value={minDecimalPlaces(
                    new BigNumber(currentStake).toFormat(),
                    2
                  )}
                  zeroDecimals={2}
                />
                <CardLabel>
                  <Balance.Value
                    tokenBalance={currentStake}
                    currency={currency}
                  />
                </CardLabel>
              </h2>
            </CardHeader>
            <Separator />
            <div style={{ padding: '0.5rem' }}>
              <h3>
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
                  {t('deductAvgCommissionOf', {
                    commission: avgCommission,
                  })}
                </button>
              </h3>
            </div>
            <RewardGrid.Root>
              <RewardGrid.Head>
                <RewardGrid.Cells
                  items={[
                    <h4>{t('period')}</h4>,
                    <h4>
                      <Token />
                      {unit}
                    </h4>,
                    <h4>{currency}</h4>,
                  ]}
                />
              </RewardGrid.Head>
              <RewardGrid.Row>
                <RewardGrid.Cell>
                  <RewardGrid.Label>{t('daily')}</RewardGrid.Label>
                </RewardGrid.Cell>
                <RewardGrid.Cell>
                  <h3>
                    {dailyReward > 0 && <FontAwesomeIcon icon={faCaretUp} />}
                    {dailyReward.toLocaleString('en-US', {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                  </h3>
                </RewardGrid.Cell>
                <RewardGrid.Cell>
                  <h3>
                    {dailyReward > 0 && tokenPrice > 0 && (
                      <FontAwesomeIcon icon={faCaretUp} />
                    )}
                    {formatLocalCurrency(dailyReward * tokenPrice)}
                  </h3>
                </RewardGrid.Cell>
              </RewardGrid.Row>
              <RewardGrid.Row>
                <RewardGrid.Cells
                  items={[
                    <RewardGrid.Label>{t('monthly')}</RewardGrid.Label>,
                    <h3>
                      {monthlyReward > 0 && (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )}
                      {monthlyReward.toLocaleString('en-US', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </h3>,
                    <h3>
                      {monthlyReward > 0 && tokenPrice > 0 && (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )}
                      {formatLocalCurrency(monthlyReward * tokenPrice)}
                    </h3>,
                  ]}
                />
              </RewardGrid.Row>
              <RewardGrid.Row>
                <RewardGrid.Cells
                  items={[
                    <RewardGrid.Label>{t('annual')}</RewardGrid.Label>,
                    <h3>
                      {annualReward > 0 && <FontAwesomeIcon icon={faCaretUp} />}
                      {annualReward.toLocaleString('en-US', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </h3>,
                    <h3>
                      {annualReward > 0 && tokenPrice > 0 && (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )}
                      {formatLocalCurrency(annualReward * tokenPrice)}
                    </h3>,
                  ]}
                />
              </RewardGrid.Row>
            </RewardGrid.Root>
          </CardWrapper>
        </Page.Row>
      )}
    </>
  )
}
