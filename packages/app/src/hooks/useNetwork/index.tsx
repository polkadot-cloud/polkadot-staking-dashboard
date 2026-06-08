// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { varToUrlHash } from '@w3ux/utils'
import { isNetworkEnabled } from 'consts/util'
import {
	getAutoRpc,
	getNetwork,
	getProviderType,
	networkConfig$,
	setNetworkConfig,
} from 'global-bus'
import { getInitialRpcEndpoints } from 'global-bus/util'
import { useCallback, useSyncExternalStore } from 'react'
import type { NetworkId } from 'types'
import type { NetworkHookInterface } from './types'

// A single RxJS subscription shared across every hook instance. Rather than each component creating
// its own subscriber, we maintain one module-level subscription that forwards emissions to a set of
// plain React callbacks. This keeps the number of RxJS subscriptions constant regardless of how
// many components call useNetwork.
const networkListeners = new Set<() => void>()
networkConfig$.subscribe(() => {
	for (const listener of networkListeners) {
		listener()
	}
})

function subscribeToNetwork(onStoreChange: () => void): () => void {
	networkListeners.add(onStoreChange)
	return () => networkListeners.delete(onStoreChange)
}

export const useNetwork = (): NetworkHookInterface => {
	// Subscribe to networkConfig$ and derive the current network id from the synchronous getNetwork()
	// snapshot on each emission.
	const network = useSyncExternalStore(
		subscribeToNetwork,
		() => getNetwork(),
		() => getNetwork(),
	)

	// Switching networks is a two-step side effect: first update the global bus config (which
	// triggers API reconnection), then persist the selection into the URL hash so a page reload or
	// shared link lands on the correct network.
	const switchNetwork = useCallback(async (name: NetworkId): Promise<void> => {
		if (!isNetworkEnabled(name)) {
			return
		}
		setNetworkConfig(
			name,
			await getInitialRpcEndpoints(name),
			getProviderType(),
			getAutoRpc(),
		)
		varToUrlHash('n', name, false)
	}, [])

	return {
		network,
		switchNetwork,
	}
}
