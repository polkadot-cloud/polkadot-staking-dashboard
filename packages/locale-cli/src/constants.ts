// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Define supported locales directly. NOTE: Not importing `locales` package to avoid browser deps in CLI
const LOCALE_DEFINITIONS = {
	en: { label: 'English' },
	zh: { label: '中文' },
	es: { label: 'Español' },
} as const

// Supported locales
export const SUPPORTED_LOCALES = Object.keys(
	LOCALE_DEFINITIONS,
) as (keyof typeof LOCALE_DEFINITIONS)[]
export type Locale = (typeof SUPPORTED_LOCALES)[number]

// Locale names for LLM context
export const LOCALE_NAMES: Record<Locale, string> = Object.fromEntries(
	Object.entries(LOCALE_DEFINITIONS).map(([key, value]) => [key, value.label]),
) as Record<Locale, string>

// Available namespace files
export const NAMESPACE_FILES = [
	'app',
	'help',
	'modals',
	'pages',
	'tips',
] as const
