// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useTokenPrices } from 'contexts/TokenPrice'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { CardWrapper } from 'library/Card/Wrappers'
import { FiatValue } from 'library/FiatValue'
import { AverageRewardRate } from 'pages/Overview/Stats/AveragelRewardRate'
import { useTranslation } from 'react-i18next'
import {
  CardHeader,
  CardLabel,
  PageRow,
  RewardGrid,
  Separator,
  StatRow,
} from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { RewardCalculator } from '../Stats/RewardCalculator'
import { StakedBalance } from '../Stats/StakedBalance'
import type { PayoutHistoryProps } from '../types'
import { RecentPayouts } from './RecentPayouts'

export const Overview = (props: PayoutHistoryProps) => {
  const { t } = useTranslation('pages')
  const {
    networkData: {
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { openModal } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const { price: tokenPrice } = useTokenPrices()
  const { getStakedBalance } = useTransferOptions()
  const { getAverageRewardRate } = useAverageRewardRate()
  const { avgRateBeforeCommission } = getAverageRewardRate(false)
  const rewardRate = avgRateBeforeCommission.toNumber()

  const currentStake = getStakedBalance(activeAccount).toNumber()
  const annualReward = currentStake * (rewardRate / 100) || 0
  const monthlyReward = annualReward / 12 || 0
  const dailyReward = annualReward / 365 || 0

  const currency = 'USD'
  const symbol = '$'

  return (
    <>
      <StatRow>
        <AverageRewardRate />
        <StakedBalance />
        <RewardCalculator
          onClick={() => {
            openModal({
              key: 'RewardCalculator',
              size: 'xs',
              options: {
                currency,
                symbol,
              },
            })
          }}
        />
      </StatRow>
      <PageRow>
        <CardWrapper>
          <RecentPayouts {...props} />
        </CardWrapper>
      </PageRow>

      {pluginEnabled('staking_api') && (
        <PageRow>
          <CardWrapper>
            <CardHeader>
              <h3>{t('rewards.projectedRewards')}</h3>
            </CardHeader>
            <Separator style={{ margin: '0 0 1.5rem 0', border: 0 }} />
            <CardHeader>
              <h4>{t('rewards.stakedBalance')}</h4>
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
                  <FiatValue tokenBalance={currentStake} currency={currency} />
                </CardLabel>
              </h2>
            </CardHeader>
            <RewardGrid.Root>
              <RewardGrid.Head>
                <RewardGrid.Cells
                  items={[
                    <h4>{t('rewards.period')}</h4>,
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
                  <RewardGrid.Label>{t('rewards.daily')}</RewardGrid.Label>
                </RewardGrid.Cell>
                <RewardGrid.Cell>
                  <h3>
                    <FontAwesomeIcon icon={faCaretUp} />
                    {dailyReward.toLocaleString('en-US', {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                  </h3>
                </RewardGrid.Cell>
                <RewardGrid.Cell>
                  <h3>
                    <FontAwesomeIcon icon={faCaretUp} />
                    {symbol}
                    {(dailyReward * tokenPrice).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </RewardGrid.Cell>
              </RewardGrid.Row>
              <RewardGrid.Row>
                <RewardGrid.Cells
                  items={[
                    <RewardGrid.Label>{t('rewards.monthly')}</RewardGrid.Label>,
                    <h3>
                      <FontAwesomeIcon icon={faCaretUp} />
                      {monthlyReward.toLocaleString('en-US', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </h3>,
                    <h3>
                      <FontAwesomeIcon icon={faCaretUp} />
                      {symbol}
                      {(monthlyReward * tokenPrice).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>,
                  ]}
                />
              </RewardGrid.Row>
              <RewardGrid.Row>
                <RewardGrid.Cells
                  items={[
                    <RewardGrid.Label>{t('rewards.annual')}</RewardGrid.Label>,
                    <h3>
                      <FontAwesomeIcon icon={faCaretUp} />
                      {annualReward.toLocaleString('en-US', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}
                    </h3>,
                    <h3>
                      <FontAwesomeIcon icon={faCaretUp} />
                      {symbol}
                      {(annualReward * tokenPrice).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>,
                  ]}
                />
              </RewardGrid.Row>
            </RewardGrid.Root>
          </CardWrapper>
        </PageRow>
      )}
    </>
  )
}
