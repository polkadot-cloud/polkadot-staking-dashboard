// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FiatCurrencyKey } from 'consts'
import { useCallback, useSyncExternalStore } from 'react'
import type { CurrencyHookInterface } from './types'
import { getUserFiatCurrency, persistCurrency } from './util'

export type { CurrencyHookInterface } from './types'

let currentCurrency: string | null = null
const listeners = new Set<() => void>()
let storageListenerAttached = false

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

const handleStorageChange = (event: StorageEvent) => {
	if (event.key === FiatCurrencyKey) {
		currentCurrency = getUserFiatCurrency()
		emitCurrencyChange()
	}
}

const attachStorageListener = () => {
	if (typeof window === 'undefined' || storageListenerAttached) {
		return
	}
	window.addEventListener('storage', handleStorageChange)
	storageListenerAttached = true
}

const detachStorageListener = () => {
	if (typeof window === 'undefined' || !storageListenerAttached) {
		return
	}
	window.removeEventListener('storage', handleStorageChange)
	storageListenerAttached = false
}

const subscribeCurrency = (listener: () => void) => {
	if (listeners.size === 0) {
		currentCurrency = getUserFiatCurrency()
		attachStorageListener()
	}
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
		if (listeners.size === 0) {
			detachStorageListener()
		}
	}
}

const setCurrencyState = (currency: string) => {
	currentCurrency = currency
	persistCurrency(currency)
	emitCurrencyChange()
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
