// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only


import { enGB, es, zhCN } from 'date-fns/locale'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import baseEn from './resources/en/base.json'
import helpEn from './resources/en/help.json'
import libEn from './resources/en/library.json'
import modalsEn from './resources/en/modals.json'
import pagesEn from './resources/en/pages.json'
import tipsEn from './resources/en/tips.json'
import type { LocaleEntry } from './types'
import { doDynamicImport, getInitialLanguage, getResources } from './util'

// The default locale.
export const DefaultLocale = 'en'

// Available locales as key value pairs.
export const locales: Record<string, LocaleEntry> = {
  en: { dateFormat: enGB, label: 'English' },
  cn: { dateFormat: zhCN, label: '中文' },
  es: { dateFormat: es, label: 'Español' },
}

// Supported namespaces.
export const lngNamespaces: string[] = [
  'base',
  'help',
  'library',
  'modals',
  'pages',
  'tips',
]

// Default structure of language resources.
export const fallbackResources = {
  ...baseEn,
  ...helpEn,
  ...libEn,
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
    debug: import.meta.env.VITE_DEBUG_I18N === '1',
    fallbackLng: DefaultLocale,
    lng: defaultLng,
    resources,
  })

// Dynamically load default language resources if needed.
if (dynamicLoad) {
  doDynamicImport(lng, i18next)
}

export * from './util'
export { i18next }
