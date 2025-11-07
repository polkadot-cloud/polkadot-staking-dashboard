// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useApi } from 'contexts/Api'
import { useSyncing } from 'hooks/useSyncing'
import type { ReactNode } from 'react'
import { createContext, useState } from 'react'
import { version } from '../../../package.json'

export const MigrateContext = createContext<null>(null)

export const MigrateProvider = ({ children }: { children: ReactNode }) => {
	const { isReady } = useApi()
	const { syncing } = useSyncing(['initialization'])

	// The local app version of the current user
	const localAppVersion = localStorage.getItem('app_version')

	// Store whether the migration check has taken place
	const [done, setDone] = useState<boolean>(localAppVersion === version)

	useEffectIgnoreInitial(() => {
		if (isReady && !syncing && !done) {
			// Carry out migrations if local version is different to current version
			if (localAppVersion !== version) {
				// Added in 2.1.3
				localStorage.removeItem('polkadotRpcEndpoints')
				localStorage.removeItem('kusamaRpcEndpoints')
				localStorage.removeItem('westendRpcEndpoints')

				// Added in 2.1.2
				localStorage.removeItem('polkadotRpcEndpoints')
				localStorage.removeItem('kusamaRpcEndpoints')
				localStorage.removeItem('westendRpcEndpoints')

				// Added in 2.0.0-beta.1
				localStorage.removeItem('polkadotRpcEndpoints')
				localStorage.removeItem('kusamaRpcEndpoints')
				localStorage.removeItem('westendRpcEndpoints')

				// Finally
				//
				// Update local version to current app version
				localStorage.setItem('app_version', version)
				setDone(true)
			}
		}
	}, [isReady, syncing])

	return (
		<MigrateContext.Provider value={null}>{children}</MigrateContext.Provider>
	)
}
