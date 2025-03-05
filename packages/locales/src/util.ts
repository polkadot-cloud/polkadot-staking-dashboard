// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// TODO: Split this file into util/language and util/
import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import { FIAT_CURRENCY_KEY } from 'consts'
import { SupportedCountries } from 'consts/countries'
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

  const supportedBrowser = Object.entries(locales).find(([locale]) =>
    navigator.language.startsWith(locale)
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
