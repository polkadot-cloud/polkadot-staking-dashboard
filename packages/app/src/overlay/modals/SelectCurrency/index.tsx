// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import CurrencySVG from 'assets/svg/icons/dollarsign.svg?react'
import {
  SUPPORTED_CURRENCIES,
  getUserFiatCurrency,
  setUserFiatCurrency,
} from 'locales/src/util'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { usePlugins } from '../../../contexts/Plugins'
import { Title } from '../../../library/Modal/Title'
import { ContentWrapper } from '../Networks/Wrapper'
import { CurrencyButton, CurrencyListWrapper } from './Wrapper'

export const SelectCurrency = () => {
  const { t } = useTranslation('modals')
  const { pluginEnabled } = usePlugins()

  // Get current currency
  const [currentCurrency, setCurrentCurrency] = useState<string>('')

  // Currency names with symbols
  const currencyNames: Record<string, { name: string; symbol: string }> = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$' },
    CHF: { name: 'Swiss Franc', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', symbol: '¥' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    INR: { name: 'Indian Rupee', symbol: '₹' },
    TRY: { name: 'Turkish Lira', symbol: '₺' },
    BRL: { name: 'Brazilian Real', symbol: 'R$' },
    COP: { name: 'Colombian Peso', symbol: 'COP$' },
    UAH: { name: 'Ukrainian Hryvnia', symbol: '₴' },
    ZAR: { name: 'South African Rand', symbol: 'R' },
    PLN: { name: 'Polish Złoty', symbol: 'zł' },
    ARS: { name: 'Argentine Peso', symbol: 'ARS$' },
    MXN: { name: 'Mexican Peso', symbol: 'MX$' },
    CZK: { name: 'Czech Koruna', symbol: 'Kč' },
    RON: { name: 'Romanian Leu', symbol: 'lei' },
    BGN: { name: 'Bulgarian Lev', symbol: 'лв' },
    SGD: { name: 'Singapore Dollar', symbol: 'S$' },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' },
    THB: { name: 'Thai Baht', symbol: '฿' },
    KRW: { name: 'South Korean Won', symbol: '₩' },
    IDR: { name: 'Indonesian Rupiah', symbol: 'Rp' },
    MYR: { name: 'Malaysian Ringgit', symbol: 'RM' },
    PHP: { name: 'Philippine Peso', symbol: '₱' },
  }

  // Get current currency on mount
  useEffect(() => {
    setCurrentCurrency(getUserFiatCurrency())
  }, [])

  // Whether Staking API is enabled (required for currency conversion)
  const stakingApiEnabled = pluginEnabled('staking_api')

  // Handle currency selection
  const handleSelect = (currency: string) => {
    setUserFiatCurrency(currency)
    setCurrentCurrency(currency)

    // Reload page to apply changes throughout the app
    window.location.reload()
  }

  // Sort currencies - put the selected one first, then sort alphabetically
  const sortedCurrencies = [...SUPPORTED_CURRENCIES].sort((a, b) => {
    if (a === currentCurrency) {
      return -1
    }
    if (b === currentCurrency) {
      return 1
    }
    return a.localeCompare(b)
  })

  return (
    <>
      <Title title={t('selectCurrency')} Svg={CurrencySVG} />
      <Padding>
        <ContentWrapper>
          <CurrencyListWrapper>
            <div className="items">
              {sortedCurrencies.map((currency) => {
                // Flag to determine if this currency is selected
                const isSelected = currentCurrency === currency

                // Disable selection if staking API is not enabled
                const disabled = !stakingApiEnabled

                return (
                  <CurrencyButton
                    type="button"
                    $connected={isSelected}
                    onClick={() => !disabled && handleSelect(currency)}
                    key={`select_${currency}`}
                    disabled={disabled}
                  >
                    <span className="currency-symbol">
                      {currencyNames[currency]?.symbol || '$'}
                    </span>
                    <span className="currency-code">{currency}</span>
                    <span className="currency-name">
                      {currencyNames[currency]?.name || 'Unknown Currency'}
                    </span>
                    {isSelected && (
                      <span className="selected">{t('selected')}</span>
                    )}
                  </CurrencyButton>
                )
              })}
            </div>

            {!stakingApiEnabled && (
              <div className="warning">{t('currencyRequiresStakingApi')}</div>
            )}
          </CurrencyListWrapper>
        </ContentWrapper>
      </Padding>
    </>
  )
}
