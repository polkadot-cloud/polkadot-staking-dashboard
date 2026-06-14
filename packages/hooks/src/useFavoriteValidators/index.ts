// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getRelayChainData } from 'consts/util'
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { NetworkId, Validator } from 'types'
import { perbillToPercent } from 'utils'
import { useApi } from '../useApi'
import { useNetwork } from '../useNetwork'
import type { FavoriteValidatorsHookInterface } from './types'

export type { FavoriteValidatorsHookInterface } from './types'

type FavoriteValidatorsStore = {
	favorites: string[]
	favoritesList: Validator[] | null
}

const listeners = new Set<() => void>()
const storesByNetwork: Partial<Record<NetworkId, FavoriteValidatorsStore>> = {}
let currentFetchKey: string | null = null

const emitFavoriteValidatorsChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const getFavoriteValidatorsKey = (network: NetworkId) => `${network}_favorites`

const getLocalFavoriteValidators = (network: NetworkId): string[] => {
	if (typeof localStorage === 'undefined') {
		return []
	}
	try {
		const localFavorites = localStorage.getItem(
			getFavoriteValidatorsKey(network),
		)
		const parsed = localFavorites ? JSON.parse(localFavorites) : []
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const setLocalFavoriteValidators = (
	network: NetworkId,
	favorites: string[],
) => {
	if (typeof localStorage === 'undefined') {
		return
	}
	localStorage.setItem(
		getFavoriteValidatorsKey(network),
		JSON.stringify(favorites),
	)
}

const getFavoriteValidatorsSnapshot = (network: NetworkId) => {
	storesByNetwork[network] ??= {
		favorites: getLocalFavoriteValidators(network),
		favoritesList: null,
	}
	return storesByNetwork[network]
}

const setFavoriteValidators = (network: NetworkId, favorites: string[]) => {
	const current = getFavoriteValidatorsSnapshot(network)
	storesByNetwork[network] = {
		...current,
		favorites,
		favoritesList: null,
	}
	setLocalFavoriteValidators(network, favorites)
	emitFavoriteValidatorsChange()
}

const setFavoriteValidatorsList = (
	network: NetworkId,
	favoritesList: Validator[],
) => {
	const current = getFavoriteValidatorsSnapshot(network)
	storesByNetwork[network] = {
		...current,
		favoritesList,
	}
	emitFavoriteValidatorsChange()
}

const syncFavoriteValidators = (network: NetworkId) => {
	const localFavorites = getLocalFavoriteValidators(network)
	const current = getFavoriteValidatorsSnapshot(network)
	if (JSON.stringify(current.favorites) !== JSON.stringify(localFavorites)) {
		storesByNetwork[network] = {
			favorites: localFavorites,
			favoritesList: null,
		}
		emitFavoriteValidatorsChange()
	}
}

const fetchFavoriteValidatorsList = async (
	network: NetworkId,
	favorites: string[],
	serviceApi: ReturnType<typeof useApi>['serviceApi'],
) => {
	const fetchKey = `${network}:${favorites.join(',')}`
	currentFetchKey = fetchKey

	if (!favorites.length) {
		setFavoriteValidatorsList(network, [])
		return
	}

	const resultsMulti = await serviceApi.query.validatorsMulti(favorites)
	if (currentFetchKey !== fetchKey) {
		return
	}

	setFavoriteValidatorsList(
		network,
		resultsMulti.flatMap((prefs, i) =>
			prefs
				? [
						{
							address: favorites[i],
							prefs: {
								commission: Number(
									perbillToPercent(prefs.commission).toString(),
								),
								blocked: prefs.blocked,
							},
						},
					]
				: [],
		),
	)
}

const subscribeFavoriteValidators = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const serverFavoriteValidatorsSnapshot: FavoriteValidatorsStore = {
	favorites: [],
	favoritesList: null,
}

export const useFavoriteValidators = (): FavoriteValidatorsHookInterface => {
	const { isReady, serviceApi } = useApi()
	const { network } = useNetwork()
	const { name } = getRelayChainData(network)
	const { favorites, favoritesList } = useSyncExternalStore(
		subscribeFavoriteValidators,
		() => getFavoriteValidatorsSnapshot(name),
		() => serverFavoriteValidatorsSnapshot,
	)

	useEffect(() => {
		syncFavoriteValidators(name)
	}, [name])

	useEffect(() => {
		if (isReady) {
			void fetchFavoriteValidatorsList(name, favorites, serviceApi)
		}
	}, [isReady, name, favorites, serviceApi])

	const addFavorite = useCallback(
		(address: string) => {
			const current = getFavoriteValidatorsSnapshot(name).favorites
			if (current.includes(address)) {
				return
			}
			setFavoriteValidators(name, [...current, address])
		},
		[name],
	)

	const removeFavorite = useCallback(
		(address: string) => {
			setFavoriteValidators(
				name,
				getFavoriteValidatorsSnapshot(name).favorites.filter(
					(favorite) => favorite !== address,
				),
			)
		},
		[name],
	)

	return {
		addFavorite,
		removeFavorite,
		favorites,
		favoritesList,
	}
}
