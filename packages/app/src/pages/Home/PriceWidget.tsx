// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import { getNetworkData } from 'consts/util'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { IGNORE_NETWORKS, useTokenPrices } from 'contexts/TokenPrice'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { CardHeader } from 'ui-core/base'

// Styled components for the price widget
const PriceWidgetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
`

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;

  .token-icon {
    margin-right: 1rem;
    display: flex;
    align-items: center;

    svg {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  .price-info {
    flex: 1;

    .price-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color-primary);
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
    }

    .price-change {
      font-size: 1rem;
      display: flex;
      align-items: center;

      &.positive {
        color: var(--status-success-color);
      }

      &.negative {
        color: var(--status-danger-color);
      }

      &.neutral {
        color: var(--text-color-secondary);
      }
    }
  }
`

const LastUpdated = styled.div`
  font-size: 0.8rem;
  color: var(--text-color-tertiary);
  text-align: right;
  padding: 0 1.5rem 0.5rem;
`

export const PriceWidget = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { currency } = useCurrency()
  const { price, change } = useTokenPrices()
  const { pluginEnabled } = usePlugins()
  const { unit } = getNetworkData(network)

  // Get token icon
  const Token = getChainIcons(network).token

  // Format price with currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

  // Determine price change class
  const changeClass =
    change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'

  // Format change with sign
  const formattedChange = `${change > 0 ? '+' : ''}${change}%`

  // Check if price data is available
  const priceAvailable =
    pluginEnabled('staking_api') &&
    !IGNORE_NETWORKS.includes(network) &&
    price > 0

  return (
    <>
      <CardHeader>
        <h4>{t('tokenPrice')}</h4>
      </CardHeader>
      <PriceWidgetWrapper>
        {priceAvailable ? (
          <>
            <PriceDisplay>
              <div className="token-icon">
                <Token />
              </div>
              <div className="price-info">
                <div className="price-value">
                  1 {unit} = {formattedPrice}
                </div>
                <div className={`price-change ${changeClass}`}>
                  {formattedChange} {t('last24Hours')}
                </div>
              </div>
            </PriceDisplay>
            <LastUpdated>{t('autoUpdates')}</LastUpdated>
          </>
        ) : (
          <PriceDisplay>
            <div className="token-icon">
              <Token />
            </div>
            <div className="price-info">
              <div className="price-value">{t('priceDataUnavailable')}</div>
              <div className="price-change neutral">
                {network === 'westend'
                  ? t('testnetNoPriceData')
                  : t('enableStakingApi')}
              </div>
            </div>
          </PriceDisplay>
        )}
      </PriceWidgetWrapper>
    </>
  )
}
