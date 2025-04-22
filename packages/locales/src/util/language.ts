// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import type { i18n } from 'i18next'

import { DefaultLocale, fallbackResources, lngNamespaces, locales } from '..'
import type { LocaleJson, LocaleJsonValue } from '../types'

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

  // Check for browser language and variants
  const browserLang = navigator.language

  // Direct match for language code (e.g., 'en-GB' matches 'enGB')
  const directMatch = Object.entries(locales).find(
    ([locale]) =>
      browserLang.replace('-', '') === locale ||
      browserLang.replace('-', '').toLowerCase() === locale.toLowerCase()
  )?.[0]

  if (directMatch) {
    localStorage.setItem('lng', directMatch)
    return directMatch
  }

  // Variant match (e.g., 'en-GB' matches 'enGB', 'en-US' matches 'en')
  const variantMatch = Object.entries(locales).find(
    ([locale]) =>
      browserLang.startsWith(locale) ||
      (browserLang.includes('-') && browserLang.split('-')[0] === locale)
  )?.[0]

  if (variantMatch) {
    localStorage.setItem('lng', variantMatch)
    return variantMatch
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
  // Get resources and check if dynamic loading is needed
  const { resources, dynamicLoad } = getResources(lng, i18next)
  const r = resources?.[lng] || {}

  localStorage.setItem('lng', lng)

  // If dynamic loading is needed, load resources
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
  try {
    const resources = await Promise.all(
      lngNamespaces.map(
        (namespace) => import(`../resources/${lng}/${namespace}.json`)
      )
    )

    const ns: LocaleJson = {}
    resources.forEach((mod: LocaleJson, i: number) => {
      ns[lngNamespaces[i]] = mod[lngNamespaces[i]]
    })
    return { l: lng, r: ns }
  } catch (error) {
    console.error(`Error loading language resources for ${lng}:`, error)
    return { l: DefaultLocale, r: {} }
  }
}

export const doDynamicImport = async (lng: string, i18next: i18n) => {
  try {
    const { l, r } = await loadLngAsync(lng)
    localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }))

    // Add the new resources
    Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
      i18next.addResourceBundle(l, ns, inner)
    })

    i18next.changeLanguage(l)
  } catch (error) {
    console.error('Error in dynamic import:', error)
  }
}

const addI18nresources = (i18n: i18n, lng: string, r: LocaleJson) => {
  Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
    i18n.addResourceBundle(lng, ns, inner)
  })
}
