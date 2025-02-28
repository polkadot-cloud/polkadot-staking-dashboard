// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import {
  CurrencyButton,
  CurrencyListWrapper,
  HeaderWrapper,
  SearchInput,
} from './Wrapper'

export const SelectCurrency = () => {
  const { t } = useTranslation('modals')
  const { pluginEnabled } = usePlugins()

  // Get current currency
  const [currentCurrency, setCurrentCurrency] = useState<string>('')

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter((currency) => {
    const searchTermLower = searchTerm.toLowerCase()
    // Get localized currency info
    const currencyName = t(`currencies.${currency}.name`).toLowerCase()
    const currencySymbol = t(`currencies.${currency}.symbol`).toLowerCase()
    const currencyCode = currency.toLowerCase()

    return (
      currencyCode.includes(searchTermLower) ||
      currencyName.includes(searchTermLower) ||
      currencySymbol.includes(searchTermLower)
    )
  })

  // Sort currencies - put the selected one first, then sort alphabetically
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
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
      <HeaderWrapper>
        <div className="title-container">
          <Title title={t('selectCurrency')} Svg={CurrencySVG} />
        </div>
        <SearchInput>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder={t('searchCurrency')}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchInput>
      </HeaderWrapper>
      <Padding>
        <ContentWrapper>
          <CurrencyListWrapper>
            <div className="items">
              {sortedCurrencies.length > 0 ? (
                sortedCurrencies.map((currency) => {
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
                        {t(`currencies.${currency}.symbol`)}
                      </span>
                      <span className="currency-code">{currency}</span>
                      <span className="currency-name">
                        {t(`currencies.${currency}.name`)}
                      </span>
                      {isSelected && (
                        <span className="selected">{t('selected')}</span>
                      )}
                    </CurrencyButton>
                  )
                })
              ) : (
                <div className="no-results">{t('noCurrenciesFound')}</div>
              )}
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
