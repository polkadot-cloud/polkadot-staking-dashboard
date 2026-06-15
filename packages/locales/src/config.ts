// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localeDefinitions } from 'consts/locales'
import type { Locale } from 'date-fns'
import appEn from './resources/en/app.json'
import helpEn from './resources/en/help.json'
import modalsEn from './resources/en/modals.json'
import pagesEn from './resources/en/pages.json'
import tipsEn from './resources/en/tips.json'
import type { LocaleEntry } from './types'

// The default locale
export const DefaultLocale = 'en'

// Available locales as key value pairs
export const locales: Record<string, LocaleEntry> = Object.fromEntries(
	Object.entries(localeDefinitions).map(([key, value]) => [
		key,
		{ label: value.label },
	]),
)

// Lazy loaders for each locale's date-fns `Locale`. These are dynamically
// imported so that only the active locale's date format data is pulled into the
// bundle, rather than eagerly bundling every locale.
const dateFormatLoaders: Record<string, () => Promise<Locale>> = {
	en: () => import('date-fns/locale/en-GB').then((m) => m.enGB),
	de: () => import('date-fns/locale/de').then((m) => m.de),
	ko: () => import('date-fns/locale/ko').then((m) => m.ko),
	pt: () => import('date-fns/locale/pt-BR').then((m) => m.ptBR),
	tr: () => import('date-fns/locale/tr').then((m) => m.tr),
	zh: () => import('date-fns/locale/zh-CN').then((m) => m.zhCN),
	es: () => import('date-fns/locale/es').then((m) => m.es),
}

// Cache of date formats that have already been loaded, keyed by locale
const dateFormatCache = new Map<string, Locale>()

// Lazy-load (and cache) the date-fns `Locale` for the given language, falling
// back to the default locale's loader for unknown keys
export const loadDateFormat = async (
	lng: string,
): Promise<Locale | undefined> => {
	const cached = dateFormatCache.get(lng)
	if (cached) {
		return cached
	}
	const loader = dateFormatLoaders[lng] ?? dateFormatLoaders[DefaultLocale]
	const dateFormat = await loader()
	dateFormatCache.set(lng, dateFormat)
	return dateFormat
}

// Synchronously read an already-loaded date format from the cache
export const getDateFormat = (lng: string): Locale | undefined =>
	dateFormatCache.get(lng)

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
