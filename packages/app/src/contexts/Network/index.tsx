// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
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
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { NetworkId } from 'types'
import type { NetworkContextInterface } from './types'

export const [NetworkContext, useNetwork] =
	createSafeContext<NetworkContextInterface>()

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
	// Store the active network in state
	const [network, setNetwork] = useState<NetworkId>(getNetwork())

	// handle network switching
	const switchNetwork = async (name: NetworkId): Promise<void> => {
		if (isNetworkEnabled(name)) {
			setNetworkConfig(
				name,
				await getInitialRpcEndpoints(name),
				getProviderType(),
				getAutoRpc(),
			)
			varToUrlHash('n', name, false)
		}
	}

	// Subscribe to global bus network changes
	useEffect(() => {
		const sub = networkConfig$.subscribe((result) => {
			setNetwork(result.network)
		})
		return () => {
			sub.unsubscribe()
		}
	}, [])

	return (
		<NetworkContext.Provider
			value={{
				network,
				switchNetwork,
			}}
		>
			{children}
		</NetworkContext.Provider>
	)
}
