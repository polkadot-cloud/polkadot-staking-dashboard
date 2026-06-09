// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FiatCurrencyKey } from 'consts'
import { useCallback, useSyncExternalStore } from 'react'
import type { CurrencyHookInterface } from './types'
import { getUserFiatCurrency, persistCurrency } from './util'

export type { CurrencyHookInterface } from './types'

let currentCurrency: string | null = null
const listeners = new Set<() => void>()

const getCurrencySnapshot = () => {
	if (!currentCurrency) {
		currentCurrency = getUserFiatCurrency()
	}
	return currentCurrency
}

const emitCurrencyChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const subscribeCurrency = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const setCurrencyState = (currency: string) => {
	currentCurrency = currency
	persistCurrency(currency)
	emitCurrencyChange()
}

if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === FiatCurrencyKey) {
			currentCurrency = getUserFiatCurrency()
			emitCurrencyChange()
		}
	})
}

export const useCurrency = (): CurrencyHookInterface => {
	const currency = useSyncExternalStore(
		subscribeCurrency,
		getCurrencySnapshot,
		() => 'USD',
	)

	const setCurrency = useCallback((currency: string) => {
		setCurrencyState(currency)
	}, [])

	return {
		currency,
		setCurrency,
	}
}
