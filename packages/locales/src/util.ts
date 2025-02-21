// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import type { i18n } from 'i18next'
import { registerSaEvent } from 'utils'
import { DefaultLocale, fallbackResources, lngNamespaces, locales } from '.'
import type { LocaleJson, LocaleJsonValue } from './types'

// Gets the active language
//
// Get the stored language from localStorage, or fallback to
// DefaultLocale otherwise.

export const getInitialLanguage = () => {
  // get language from url if present
  const urlLng = extractUrlValue('l')

  if (Object.keys(locales).find((key) => key === urlLng) && urlLng) {
    registerSaEvent(`locale_from_url_${urlLng}`)
    localStorage.setItem('lng', urlLng)
    return urlLng
  }

  // fall back to localStorage if present
  const localLng = localStorage.getItem('lng')
  if (localLng && Object.keys(locales).find((key) => key === localLng)) {
    return localLng
  }

  // fall back to browser language
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

// Determine resources of selected language, and whether a dynamic
// import is needed for missing language resources.
//
// If selected language is DefaultLocale, then we fall back to
// the default language resources that have already been imported.
export const getResources = (lng: string, i18n?: i18n) => {
  let dynamicLoad = false

  let resources: Record<string, LocaleJson> = {}
  if (lng === DefaultLocale) {
    // determine resources exist without dynamically importing them.
    resources = {
      [lng]: fallbackResources,
    }
    localStorage.setItem(
      'lng_resources',
      JSON.stringify({ l: lng, r: fallbackResources })
    )
    // Add language to i18n if it does not exist.
    if (i18n && !i18n.hasResourceBundle(lng, 'app')) {
      addI18nresources(i18n, lng, fallbackResources)
    }
  } else {
    // not the default locale, check if local resources exist
    let localValid = false
    const localResources = localStorage.getItem('lng_resources')
    if (localResources !== null) {
      const { l, r } = JSON.parse(localResources)

      if (l === lng) {
        localValid = true
        // local resources found, load them in
        resources = {
          [lng]: {
            ...r,
          },
        }
      }
    }
    if (!localValid) {
      // no resources exist locally, dynamic import needed.
      dynamicLoad = true
      resources = {
        en: fallbackResources,
      }
    }
  }
  return {
    resources,
    dynamicLoad,
  }
}

// Change language
//
// On click handler for changing language in-app.
export const changeLanguage = async (lng: string, i18next: i18n) => {
  registerSaEvent(`locale_from_modal_${lng}`)
  // check whether resources exist and need to by dynamically loaded.
  const { resources, dynamicLoad } = getResources(lng, i18next)

  const r = resources?.[lng] || {}

  localStorage.setItem('lng', lng)
  // dynamically load default language resources if needed.
  if (dynamicLoad) {
    await doDynamicImport(lng, i18next)
  } else {
    localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }))
    i18next.changeLanguage(lng)
  }
  // update url `l` if needed.
  varToUrlHash('l', lng, false)
}

// Load language resources dynamically.
//
// Bootstraps i18next with additional language resources.
export const loadLngAsync = async (lng: string) => {
  const resources = await Promise.all(
    lngNamespaces.map(async (namespace) => {
      const json = await import(`./resources/${lng}/${namespace}.json`)
      return json
    })
  )

  const ns: LocaleJson = {}
  resources.forEach((mod: LocaleJson, i: number) => {
    ns[lngNamespaces[i]] = mod[lngNamespaces[i]]
  })

  return {
    l: lng,
    r: ns,
  }
}

// Handles a dynamic import.
//
// Once imports have been loaded, they are added to i18next as resources.
// Finally, the active language is changed to the imported language.
export const doDynamicImport = async (lng: string, i18next: i18n) => {
  const { l, r } = await loadLngAsync(lng)

  localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }))

  Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
    i18next.addResourceBundle(l, ns, inner)
  })
  i18next.changeLanguage(l)
}

// Adds resources to i18next.
const addI18nresources = (i18n: i18n, lng: string, r: LocaleJson) => {
  Object.entries(r).forEach(([ns, inner]: [string, LocaleJsonValue]) => {
    i18n.addResourceBundle(lng, ns, inner)
  })
}
