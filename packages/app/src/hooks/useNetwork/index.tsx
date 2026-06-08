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

// A single RxJS subscription shared across every hook instance. The subscription is reference-
// counted: it is created when the first component mounts and torn down when the last one unmounts,
// so no RxJS subscriber is held open while the hook has no consumers.
const networkListeners = new Set<() => void>()
let networkRxSubscription: { unsubscribe(): void } | null = null

function subscribeToNetwork(onStoreChange: () => void): () => void {
	if (networkListeners.size === 0) {
		networkRxSubscription = networkConfig$.subscribe(() => {
			for (const listener of networkListeners) {
				listener()
			}
		})
	}
	networkListeners.add(onStoreChange)
	return () => {
		networkListeners.delete(onStoreChange)
		if (networkListeners.size === 0) {
			networkRxSubscription?.unsubscribe()
			networkRxSubscription = null
		}
	}
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
