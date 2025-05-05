// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { enGB, enUS, es, zhCN } from 'date-fns/locale'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import appEn from './resources/en/app.json'
import helpEn from './resources/en/help.json'
import modalsEn from './resources/en/modals.json'
import pagesEn from './resources/en/pages.json'
import tipsEn from './resources/en/tips.json'
import type { LocaleEntry } from './types'
import { doDynamicImport, getInitialLanguage, getResources } from './util'

// The default locale.
export const DefaultLocale = 'en'

// Available locales as key value pairs.
export const locales: Record<string, LocaleEntry> = {
  en: { dateFormat: enUS, label: 'English (US)', variant: 'en' },
  // We're removing enGB and handling it via suffix instead
  zh: { dateFormat: zhCN, label: '中文', variant: 'zh' },
  es: { dateFormat: es, label: 'Español', variant: 'es' },
}

// For UI display of language selection, including suffix-based variants
export const displayLocales: Record<string, LocaleEntry> = {
  en: { dateFormat: enUS, label: 'English (US)', variant: 'en' },
  'en-GB': { dateFormat: enGB, label: 'English (UK)', variant: 'en' }, // British English as a variant
  zh: { dateFormat: zhCN, label: '中文', variant: 'zh' },
  es: { dateFormat: es, label: 'Español', variant: 'es' },
}

// Supported namespaces.
export const lngNamespaces: string[] = [
  'app',
  'help',
  'modals',
  'pages',
  'tips',
]

// Default structure of language resources.
export const fallbackResources = {
  ...appEn,
  ...helpEn,
  ...modalsEn,
  ...pagesEn,
  ...tipsEn,
}

// Get initial language.
const lng: string = getInitialLanguage()

// Get default resources and whether a dynamic load is required for
// the active language.
const { resources, dynamicLoad } = getResources(lng)

// Default language to show before any dynamic load
const defaultLng = dynamicLoad ? DefaultLocale : lng

// Configure i18n object.
i18next
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: DefaultLocale,
    lng: defaultLng,
    resources,
  })

// If dynamic loading is needed and default language is not the same as lng,
// import lng resources and change language.
if (dynamicLoad && defaultLng !== lng) {
  doDynamicImport(lng, i18next)
}

export default i18next
