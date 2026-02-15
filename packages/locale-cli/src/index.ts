// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenAI from 'openai'

// Get the workspace root by tracing up from the current file location
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const WORKSPACE_ROOT = join(__dirname, '../../..')

// Define supported locales directly. NOTE: Not importing `locales` package to avoid browser deps in
// CLI
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

export type NamespaceFile = (typeof NAMESPACE_FILES)[number]

// Context about Polkadot and the staking dashboard
const POLKADOT_CONTEXT = `
Polkadot is a blockchain platform that enables multiple specialized blockchains to interoperate in a shared security model. It uses a Nominated Proof-of-Stake (NPoS) consensus mechanism.

The Polkadot Staking Dashboard is a web application that allows users to:
- Stake their DOT tokens by nominating validators
- Join nomination pools for collective staking
- Monitor their staking rewards and performance
- Manage their bonded funds and nominations
- Track validator performance and commission rates

Key staking concepts:
- Validators: Nodes that validate blocks and secure the network
- Nominators: Token holders who back validators with their stake
- Nomination Pools: Allow users to pool their stake together
- Commission: The percentage validators take from staking rewards
- Bonding: Locking tokens for staking (with an unbonding period)
- Era: A time period in Polkadot (approximately 24 hours)

When translating, maintain technical accuracy for blockchain and staking terminology while making the interface accessible to users.
`

/**
 * Translates text using OpenAI API
 */
export async function translateWithOpenAI(
	text: string,
	targetLocale: Locale,
	description?: string,
	apiKey?: string,
): Promise<string> {
	const key = apiKey || process.env.OPENAI_API_KEY

	if (!key) {
		throw new Error(
			'OpenAI API key not found. Set OPENAI_API_KEY environment variable.',
		)
	}

	const openai = new OpenAI({ apiKey: key })

	const systemPrompt = `You are a professional translator specializing in blockchain and cryptocurrency interfaces. ${POLKADOT_CONTEXT}`

	const userPrompt = `Translate the following text to ${LOCALE_NAMES[targetLocale]}:

Text: "${text}"
${description ? `Context: ${description}` : ''}

Requirements:
- Maintain technical accuracy for blockchain and staking terminology
- Keep the translation natural and user-friendly
- Preserve any special formatting or placeholders (e.g., {{variable}})
- Return ONLY the translated text, no explanations or quotation marks`

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt },
		],
		temperature: 0.3,
		max_tokens: 500,
	})

	const translation = response.choices[0]?.message?.content?.trim()
	if (!translation) {
		throw new Error('No translation received from OpenAI')
	}

	return translation
}

/**
 * Reads a locale JSON file
 */
export function readLocaleFile(
	locale: Locale,
	file: NamespaceFile,
	localesPath: string,
): Record<string, unknown> {
	const filePath = join(localesPath, locale, `${file}.json`)
	const content = readFileSync(filePath, 'utf-8')
	return JSON.parse(content)
}

/**
 * Writes to a locale JSON file
 */
export function writeLocaleFile(
	locale: Locale,
	file: NamespaceFile,
	data: Record<string, unknown>,
	localesPath: string,
): void {
	const filePath = join(localesPath, locale, `${file}.json`)
	writeFileSync(filePath, `${JSON.stringify(data, null, '\t')}\n`, 'utf-8')
}

/**
 * Recursively sets a nested key in an object
 * Uses safe property assignment to prevent prototype pollution
 */
export function setNestedKey(
	obj: Record<string, unknown>,
	keyPath: string,
	value: string,
): void {
	const keys = keyPath.split('.')

	// Validate keys to prevent prototype pollution
	const dangerousKeys = ['__proto__', 'constructor', 'prototype']
	for (const key of keys) {
		if (dangerousKeys.includes(key)) {
			throw new Error(
				`Invalid key "${key}" in path "${keyPath}". Keys cannot be __proto__, constructor, or prototype.`,
			)
		}
	}

	let current = obj

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]

		// Additional check to ensure key is safe
		if (
			!(key in current) ||
			typeof current[key] !== 'object' ||
			current[key] === null
		) {
			// Use Object.defineProperty for safer property creation
			Object.defineProperty(current, key, {
				value: {},
				writable: true,
				enumerable: true,
				configurable: true,
			})
		}

		// Get the next level safely
		const next = current[key]
		// Additional validation before reassignment
		if (typeof next !== 'object' || next === null) {
			throw new Error(
				`Cannot traverse key path "${keyPath}" - invalid structure`,
			)
		}
		current = next as Record<string, unknown>
	}

	const finalKey = keys[keys.length - 1]
	// Use Object.defineProperty for safer property assignment
	// Safe from prototype pollution due to key validation above
	// lgtm[js/prototype-pollution-utility]
	Object.defineProperty(current, finalKey, {
		value,
		writable: true,
		enumerable: true,
		configurable: true,
	})
}

/**
 * Checks if a key already exists in the locale file
 */
export function keyExists(
	data: Record<string, unknown>,
	keyPath: string,
): boolean {
	const keys = keyPath.split('.')
	let current: unknown = data

	for (const key of keys) {
		if (
			typeof current !== 'object' ||
			current === null ||
			!(key in (current as Record<string, unknown>))
		) {
			return false
		}
		current = (current as Record<string, unknown>)[key]
	}

	return true
}

/**
 * Main function to add a locale key
 */
export async function addLocaleKey(
	key: string,
	text: string,
	file: NamespaceFile,
	description?: string,
	apiKey?: string,
): Promise<void> {
	const localesPath = join(
		WORKSPACE_ROOT,
		'packages',
		'locales',
		'src',
		'resources',
	)

	console.log(`\nAdding locale key: ${key}`)
	console.log(`File: ${file}.json`)
	console.log(`English text: "${text}"`)
	if (description) {
		console.log(`Description: ${description}`)
	}

	// Check if key already exists in English
	const enData = readLocaleFile('en', file, localesPath)
	if (keyExists(enData, key)) {
		throw new Error(
			`Key "${key}" already exists in en/${file}.json. Use a different key or update the existing one manually.`,
		)
	}

	// Add to English first
	console.log('\nAdding to English (en)...')
	setNestedKey(enData, key, text)
	writeLocaleFile('en', file, enData, localesPath)
	console.log('✓ Added to en')

	// Translate and add to other locales
	for (const locale of SUPPORTED_LOCALES) {
		if (locale === 'en') continue

		console.log(`\nTranslating to ${LOCALE_NAMES[locale]} (${locale})...`)
		const translation = await translateWithOpenAI(
			text,
			locale,
			description,
			apiKey,
		)
		console.log(`Translation: "${translation}"`)

		const localeData = readLocaleFile(locale, file, localesPath)
		setNestedKey(localeData, key, translation)
		writeLocaleFile(locale, file, localeData, localesPath)
		console.log(`✓ Added to ${locale}`)
	}

	console.log('\n✓ Translations added successfully!')
	console.log(
		'\nNote: Running pnpm order and pnpm validate in locales package...',
	)
}
