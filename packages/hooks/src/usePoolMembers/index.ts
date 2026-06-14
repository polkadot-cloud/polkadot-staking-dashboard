// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useSyncExternalStore } from 'react'
import { useApi } from '../useApi'
import { defaultPoolMemberData } from './defaults'
import type {
	FetchedPoolMembers,
	PoolMembersHookInterface,
	PoolMembersSync,
} from './types'

export { defaultPoolMemberData } from './defaults'
export type {
	FetchedPoolMember,
	FetchedPoolMembers,
	PoolMembersHookInterface,
	PoolMembersSync,
} from './types'

type PoolMembersState = {
	meta: FetchedPoolMembers
	fetchedPoolMembersApi: PoolMembersSync
}

const defaultPoolMembersState: PoolMembersState = {
	meta: defaultPoolMemberData,
	fetchedPoolMembersApi: 'unsynced',
}

const listeners = new Set<() => void>()
let currentPoolMembersState = defaultPoolMembersState

const emitPoolMembersChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const subscribePoolMembers = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const getPoolMembersSnapshot = () => currentPoolMembersState

const setPoolMembersState = (next: Partial<PoolMembersState>) => {
	currentPoolMembersState = {
		...currentPoolMembersState,
		...next,
	}
	emitPoolMembersChange()
}

const setFetchedPoolMembersApi = (status: PoolMembersSync) => {
	setPoolMembersState({ fetchedPoolMembersApi: status })
}

const resetPoolMemberData = () => {
	setPoolMembersState(defaultPoolMembersState)
}

export const usePoolMembers = (): PoolMembersHookInterface => {
	const { isReady, serviceApi } = useApi()
	const { meta, fetchedPoolMembersApi } = useSyncExternalStore(
		subscribePoolMembers,
		getPoolMembersSnapshot,
		getPoolMembersSnapshot,
	)

	const fetchPoolMemberData = useCallback(
		async (addresses: string[]) => {
			if (!isReady) {
				return
			}
			setPoolMembersState({ meta: defaultPoolMemberData })

			if (!addresses.length) {
				return
			}
			const [poolMembers, claimPermissions] = await Promise.all([
				serviceApi.query.poolMembersMulti(addresses),
				serviceApi.query.claimPermissionsMulti(addresses),
			])

			setPoolMembersState({
				meta: {
					addresses,
					poolMembers: poolMembers.map((member, i) => {
						if (!member) {
							return undefined
						}
						return {
							...member,
							address: addresses[i],
						}
					}),
					claimPermissions,
				},
			})
		},
		[isReady, serviceApi],
	)

	return {
		fetchPoolMemberData,
		fetchedPoolMembersApi,
		meta,
		resetPoolMemberData,
		setFetchedPoolMembersApi,
	}
}
