// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FiatCurrencyKey } from 'consts'
import { SupportedCountries } from 'consts/countries'
import { SupportedCurrencies } from 'consts/currencies'

const isSupportedCurrency = (currency: string) =>
	Object.keys(SupportedCurrencies).includes(currency)

export const getUserFiatCurrency = (): string => {
	if (typeof window === 'undefined') {
		return 'USD'
	}

	const storedCurrency = localStorage.getItem(FiatCurrencyKey)
	if (storedCurrency && isSupportedCurrency(storedCurrency)) {
		return storedCurrency
	}

	const locale = navigator.language
	const parts = locale.split('-')
	if (parts.length > 1) {
		const countryCode = parts[1].toUpperCase()
		const fiat = SupportedCountries[countryCode]?.defaultCurrency
		if (fiat && isSupportedCurrency(fiat)) {
			return fiat
		}
	}

	const countryFromLang = Object.entries(SupportedCountries).find(([, meta]) =>
		meta.languages.includes(locale),
	)?.[0]
	if (countryFromLang) {
		const fiat = SupportedCountries[countryFromLang]?.defaultCurrency
		if (fiat && isSupportedCurrency(fiat)) {
			return fiat
		}
	}

	return 'USD'
}

export const persistCurrency = (currency: string) => {
	if (isSupportedCurrency(currency)) {
		localStorage.setItem(FiatCurrencyKey, currency)
	}
}
