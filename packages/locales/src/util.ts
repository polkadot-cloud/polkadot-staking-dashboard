// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// TODO: Split this file into util/language and util/
import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import { SupportedCurrencies } from 'consts/currencies'
import type { i18n } from 'i18next'
import { DefaultLocale, fallbackResources, lngNamespaces, locales } from '.'
import type { LocaleJson, LocaleJsonValue } from './types'

/* Language Management */
export const getInitialLanguage = () => {
  const urlLng = extractUrlValue('l')
  if (Object.keys(locales).find((key) => key === urlLng) && urlLng) {
    localStorage.setItem('lng', urlLng)
    return urlLng
  }

  const localLng = localStorage.getItem('lng')
  if (localLng && Object.keys(locales).find((key) => key === localLng)) {
    return localLng
  }

  const supportedBrowser = Object.entries(locales).find(([, { tag }]) =>
    navigator.language.startsWith(tag)
  )?.[0]
  if (supportedBrowser) {
    localStorage.setItem('lng', supportedBrowser)
    return supportedBrowser
  }

  localStorage.setItem('lng', DefaultLocale)
  return DefaultLocale
}

export const getResources = (lng: string, i18n?: i18n) => {
  let dynamicLoad = false
  let resources: Record<string, LocaleJson> = {}

  if (lng === DefaultLocale) {
    resources = { [lng]: fallbackResources }
    localStorage.setItem(
      'lng_resources',
      JSON.stringify({ l: lng, r: fallbackResources })
    )
    // Add language to i18n if it does not exist.
    if (i18n && !i18n.hasResourceBundle(lng, 'app')) {
      addI18nresources(i18n, lng, fallbackResources)
    }
  } else {
    let localValid = false
    const localResources = localStorage.getItem('lng_resources')
    if (localResources !== null) {
      const { l, r } = JSON.parse(localResources)
      if (l === lng) {
        localValid = true
        resources = { [lng]: { ...r } }
      }
    }
    if (!localValid) {
      dynamicLoad = true
      resources = { en: fallbackResources }
    }
  }
  return { resources, dynamicLoad }
}

export const changeLanguage = async (lng: string, i18next: i18n) => {
  const { resources, dynamicLoad } = getResources(lng, i18next)
  const r = resources?.[lng] || {}

  localStorage.setItem('lng', lng)
  if (dynamicLoad) {
    await doDynamicImport(lng, i18next)
  } else {
    localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }))
    i18next.changeLanguage(lng)
  }
  varToUrlHash('l', lng, false)
}

/* Resource Loading */
export const loadLngAsync = async (lng: string) => {
  const resources = await Promise.all(
    lngNamespaces.map(
      (namespace) => import(`./resources/${lng}/${namespace}.json`)
    )
  )

  const ns: LocaleJson = {}
  resources.forEach((mod: LocaleJson, i: number) => {
    ns[lngNamespaces[i]] = mod[lngNamespaces[i]]
  })
  return { l: lng, r: ns }
}

export const doDynamicImport = async (lng: string, i18next: i18n) => {
  const { l, r } = await loadLngAsync(lng)
  localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }))
  Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
    i18next.addResourceBundle(l, ns, inner)
  })
  i18next.changeLanguage(l)
}

const addI18nresources = (i18n: i18n, lng: string, r: LocaleJson) => {
  Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
    i18n.addResourceBundle(lng, ns, inner)
  })
}

/* Currency Management */
// Local storage key for user fiat currency preference
const FIAT_CURRENCY_KEY = 'user_fiat_currency'

// Map of countries to their currencies
// NOTE: Can we flatten this with `languageToCountry`?
const countryToFiatMap: { [key: string]: string } = {
  // Euro Zone
  AT: 'EUR',
  BE: 'EUR',
  CY: 'EUR',
  DE: 'EUR',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  GR: 'EUR',
  HR: 'EUR',
  IE: 'EUR',
  IT: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  SI: 'EUR',
  SK: 'EUR',
  // Other Countries
  AR: 'ARS',
  AU: 'AUD',
  BR: 'BRL',
  CA: 'CAD',
  CH: 'CHF',
  CN: 'CNY',
  CO: 'COP',
  CZ: 'CZK',
  GB: 'GBP',
  IN: 'INR',
  JP: 'JPY',
  MX: 'MXN',
  PL: 'PLN',
  RO: 'RON',
  TR: 'TRY',
  UA: 'UAH',
  US: 'USD',
  ZA: 'ZAR',
  BG: 'BGN',
  SG: 'SGD',
  NZ: 'NZD',
  TH: 'THB',
  KR: 'KRW',
  ID: 'IDR',
  MY: 'MYR',
  PH: 'PHP',
}

// Map of language codes to countries
const languageToCountry: { [key: string]: string } = {
  af: 'ZA',
  cs: 'CZ',
  de: 'DE',
  el: 'GR',
  en: 'US',
  'en-GB': 'GB',
  'en-US': 'US',
  'en-CA': 'CA',
  'en-AU': 'AU',
  es: 'ES',
  et: 'EE',
  fi: 'FI',
  fr: 'FR',
  'fr-CA': 'CA',
  hr: 'HR',
  hu: 'HU',
  it: 'IT',
  ja: 'JP',
  lt: 'LT',
  lv: 'LV',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT',
  'pt-BR': 'BR',
  ro: 'RO',
  sk: 'SK',
  sl: 'SI',
  tr: 'TR',
  uk: 'UA',
  zh: 'CN',
  'zh-CN': 'CN',
  bg: 'BG',
  th: 'TH',
  ko: 'KR',
  id: 'ID',
  ms: 'MY',
  tl: 'PH',
}

/**
 * Get the user's preferred fiat currency from local storage or browser locale
 */
export const getUserFiatCurrency = (): string => {
  // Try to get from local storage first
  const storedCurrency = localStorage.getItem(FIAT_CURRENCY_KEY)
  if (
    storedCurrency &&
    Object.keys(SupportedCurrencies).includes(storedCurrency)
  ) {
    return storedCurrency
  }

  // Abstract into utility function ----------
  // Try to get from browser locale
  const locale = navigator.language

  // Try to get country from locale (e.g., en-US -> US)
  const parts = locale.split('-')
  if (parts.length > 1) {
    const countryCode = parts[1].toUpperCase()
    const fiat = countryToFiatMap[countryCode]
    if (fiat && Object.keys(SupportedCurrencies).includes(fiat)) {
      return fiat
    }
  }
  // -------------------------------------------

  // Abstract into utility function ----------
  // Try to get country from language (e.g., fr -> FR)
  const countryFromLang =
    languageToCountry[locale] || languageToCountry[parts[0]]
  if (countryFromLang) {
    const fiat = countryToFiatMap[countryFromLang]
    if (fiat && Object.keys(SupportedCurrencies).includes(fiat)) {
      return fiat
    }
  }
  // -------------------------------------------

  // Default to USD
  return 'USD'
}

/**
 * Set the user's preferred fiat currency
 * @param currency The currency code to set (e.g., 'USD', 'EUR')
 */
export const setLocalCurrency = (currency: string): void => {
  if (Object.keys(SupportedCurrencies).includes(currency)) {
    localStorage.setItem(FIAT_CURRENCY_KEY, currency)
  }
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
