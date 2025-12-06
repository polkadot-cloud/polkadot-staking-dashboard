// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { useEffect, useState } from 'react'
import type { ActiveProxy, MaybeAddress } from 'types'
import type { UseProxySwitcher } from './types'

export const useProxySwitcher = (
	delegatorAddress: MaybeAddress,
	initialProxy: ActiveProxy | null,
): UseProxySwitcher => {
	const { getDelegates } = useProxies()
	const { accounts } = useImportedAccounts()

	// Get delegates for the account
	const delegatesData = getDelegates(delegatorAddress)
	const proxyDelegates = delegatesData?.delegates || []

	// Expand delegates by finding all imported accounts for each delegate address. The same address
	// may be imported from multiple sources
	const delegates = proxyDelegates.flatMap(({ delegate, proxyType }) => {
		const matchingAccounts = accounts.filter((acc) => acc.address === delegate)
		return matchingAccounts.map((account) => ({
			address: account.address,
			source: account.source,
			proxyType,
		}))
	})

	// Current proxy account - only state we need
	const [currentProxy, setCurrentProxy] = useState<ActiveProxy | null>(
		initialProxy || (delegates.length > 0 ? delegates[0] : null),
	)

	// Derive current index from currentProxy and delegates
	const currentIndex = currentProxy
		? delegates.findIndex(
				(d) =>
					d.address === currentProxy.address &&
					d.source === currentProxy.source,
			)
		: -1

	// Switch to next delegate
	const nextProxy = () => {
		if (delegates.length <= 1) {
			return
		}
		const validIndex = currentIndex >= 0 ? currentIndex : 0
		const nextIndex = (validIndex + 1) % delegates.length
		setCurrentProxy(delegates[nextIndex])
	}

	// Switch to previous delegate
	const previousProxy = () => {
		if (delegates.length <= 1) {
			return
		}
		const validIndex = currentIndex >= 0 ? currentIndex : 0
		const prevIndex = (validIndex - 1 + delegates.length) % delegates.length
		setCurrentProxy(delegates[prevIndex])
	}

	// Update current proxy if delegates change and current proxy is no longer valid
	useEffect(() => {
		if (delegates.length === 0) {
			setCurrentProxy(null)
			return
		}
		// If current proxy is not in the delegates list, reset to first delegate
		if (currentIndex === -1) {
			setCurrentProxy(delegates[0])
		}
	}, [delegates.length, currentIndex])

	return {
		currentProxy,
		delegates,
		currentIndex,
		hasMultipleDelegates: delegates.length > 1,
		nextProxy,
		previousProxy,
	}
}
