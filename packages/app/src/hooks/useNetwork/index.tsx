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

export const useNetwork = (): NetworkHookInterface => {
	const network = useSyncExternalStore(
		(onStoreChange) => {
			const subscription = networkConfig$.subscribe(() => {
				onStoreChange()
			})
			return () => subscription.unsubscribe()
		},
		() => getNetwork(),
		() => getNetwork(),
	)

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
