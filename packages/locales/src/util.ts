// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
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
export const fiatMapping: { [key: string]: string } = {
  ARS: 'ARS',
  BRL: 'BRL',
  COP: 'COP',
  CZK: 'CZK',
  EUR: 'EUR',
  MXN: 'MXN',
  PLN: 'PLN',
  RON: 'RON',
  TRY: 'TRY',
  UAH: 'UAH',
  ZAR: 'ZAR',
}

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
  BR: 'BRL',
  CO: 'COP',
  CZ: 'CZK',
  MX: 'MXN',
  PL: 'PLN',
  RO: 'RON',
  TR: 'TRY',
  UA: 'UAH',
  ZA: 'ZAR',
}

const languageToCountry: { [key: string]: string } = {
  af: 'ZA',
  cs: 'CZ',
  de: 'DE',
  el: 'GR',
  et: 'EE',
  fi: 'FI',
  fr: 'FR',
  hr: 'HR',
  hu: 'HU',
  it: 'IT',
  lt: 'LT',
  lv: 'LV',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT',
  ro: 'RO',
  sk: 'SK',
  sl: 'SI',
  tr: 'TR',
  uk: 'UA',
}

export const getUserFiatCurrency = (): string | null => {
  const locale = navigator.language
  const parts = locale.split('-')

  if (parts[1]) {
    const countryCode = parts[1].toUpperCase()
    const fiat = countryToFiatMap[countryCode]
    if (fiatMapping[fiat]) {
      return fiat
    }
  }

  const countryFromLang = languageToCountry[parts[0]]
  if (countryFromLang) {
    const fiat = countryToFiatMap[countryFromLang]
    if (fiatMapping[fiat]) {
      return fiat
    }
  }

  return null
}
