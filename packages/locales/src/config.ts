// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localeDefinitions } from 'consts/locales'
import { de, enGB, es, ko, type Locale, ptBR, zhCN } from 'date-fns/locale'
import appEn from './resources/en/app.json'
import helpEn from './resources/en/help.json'
import modalsEn from './resources/en/modals.json'
import pagesEn from './resources/en/pages.json'
import tipsEn from './resources/en/tips.json'
import type { LocaleEntry } from './types'

// The default locale
export const DefaultLocale = 'en'

// Date formats for each locale
const dateFormats: Record<string, Locale> = {
	en: enGB,
	de: de,
	ko: ko,
	pt: ptBR,
	zh: zhCN,
	es: es,
}

// Available locales as key value pairs
export const locales: Record<string, LocaleEntry> = Object.entries(
	localeDefinitions,
).reduce(
	(acc, [key, value]) => {
		const dateFormat = dateFormats[key]
		if (!dateFormat) {
			throw new Error(`Missing date format for locale: ${key}`)
		}
		acc[key] = { ...value, dateFormat }
		return acc
	},
	{} as Record<string, LocaleEntry>,
)

// Supported namespaces
export const lngNamespaces: string[] = [
	'app',
	'help',
	'modals',
	'pages',
	'tips',
]

// Default structure of language resources
export const fallbackResources = {
	...appEn,
	...helpEn,
	...modalsEn,
	...pagesEn,
	...tipsEn,
}
