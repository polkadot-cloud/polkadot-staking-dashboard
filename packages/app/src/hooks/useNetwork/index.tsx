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
import { createObservableStore } from '../util'
import type { NetworkHookInterface } from './types'

// Pass getNetwork as a getter so the store calls it on each emission rather than caching the
// emitted config object. This means the snapshot is always the current NetworkId.
const networkStore = createObservableStore<NetworkId>(
	networkConfig$,
	getNetwork,
)

export const useNetwork = (): NetworkHookInterface => {
	const network = useSyncExternalStore(
		networkStore.subscribe,
		networkStore.getSnapshot,
		networkStore.getSnapshot,
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
