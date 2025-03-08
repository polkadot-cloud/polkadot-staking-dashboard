// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FiatCurrencyKey } from 'consts'
import { SupportedCountries } from 'consts/countries'
import { SupportedCurrencies } from 'consts/currencies'

/**
 * Get the user's preferred fiat currency from local storage or browser locale
 */
export const getUserFiatCurrency = (): string => {
  // Try to get from local storage first
  const storedCurrency = localStorage.getItem(FiatCurrencyKey)
  if (
    storedCurrency &&
    Object.keys(SupportedCurrencies).includes(storedCurrency)
  ) {
    return storedCurrency
  }
  const locale = navigator.language

  // Get country from locale (e.g., en-US -> US)
  const parts = locale.split('-')
  if (parts.length > 1) {
    const countryCode = parts[1].toUpperCase()
    const fiat = SupportedCountries[countryCode]?.defaultCurrency
    if (fiat && Object.keys(SupportedCurrencies).includes(fiat)) {
      return fiat
    }
  }

  // Fallback 1: Find the first country that includes `locale` as a language
  const countryFromLang = Object.entries(SupportedCountries).find(([, meta]) =>
    meta.languages.includes(locale)
  )?.[0]
  if (countryFromLang) {
    const fiat = SupportedCountries[countryFromLang]?.defaultCurrency
    if (fiat && Object.keys(SupportedCurrencies).includes(fiat)) {
      return fiat
    }
  }
  // Fallback 2: Default to USD
  return 'USD'
}

/**
 * Format a number as currency based on the user's preferred currency and locale
 */
export const formatFiatCurrency = (
  value: number,
  currency?: string
): string => {
  const currencyCode = currency || getUserFiatCurrency()
  const locale = navigator.language || 'en-US'

  const decimals: number = SupportedCurrencies[currencyCode]?.noDecimals ? 0 : 2

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
