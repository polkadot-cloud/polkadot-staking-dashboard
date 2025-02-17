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
  Separator,
  StatRow,
} from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { RewardCalculator } from '../Stats/RewardCalculator'
import { StakedBalance } from '../Stats/StakedBalance'
import { RewardsGrid } from '../Wrappers'
import type { PageProps } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Overview = (_: PageProps) => {
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

  // Determine label depending if custom balance is active
  const balanceLabel = t('rewards.stakedBalance')

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

      {pluginEnabled('staking_api') && (
        <PageRow>
          <CardWrapper>
            <CardHeader>
              <h4>{balanceLabel}</h4>
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
            <Separator style={{ margin: '0 0 1.5rem 0' }} />

            <CardHeader>
              <h4>{t('rewards.projectedRewards')}</h4>
            </CardHeader>

            <RewardsGrid>
              <div className="row head">
                <div>
                  <h4>{t('rewards.period')}</h4>
                </div>
                <div>
                  <h4>{unit}</h4>
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
                    {(dailyReward * tokenPrice).toLocaleString('en-US', {
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
                    {(monthlyReward * tokenPrice).toLocaleString('en-US', {
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
                    {(annualReward * tokenPrice).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
              </div>
            </RewardsGrid>
          </CardWrapper>
        </PageRow>
      )}
    </>
  )
}
