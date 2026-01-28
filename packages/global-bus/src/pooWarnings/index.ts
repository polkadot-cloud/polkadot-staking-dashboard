// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { fetchPoolWarnings } from 'plugin-staking-api'
import type { NetworkId } from 'types'
import { pluginEnabled } from '../plugins'
import { defaultPoolWarnings } from './default'
import { _poolWarnings } from './private'

export interface PoolWarning {
	poolId: number
	address: string
	type: 'destroying' | 'highCommission'
}

export interface PoolWarningsState {
	[address: string]: PoolWarning[]
}

export const poolWarnings$ = _poolWarnings.asObservable()

export const getPoolWarnings = (): PoolWarningsState => _poolWarnings.getValue()

export const getPoolWarningsForAddress = (address: string): PoolWarning[] =>
	_poolWarnings.getValue()[address] || []

export const setPoolWarnings = (
	address: string,
	warnings: PoolWarning[],
): void => {
	_poolWarnings.next({
		..._poolWarnings.value,
		[address]: warnings,
	})
}

export const setPoolWarningsBatch = (
	warningsMap: Record<string, PoolWarning[]>,
): void => {
	_poolWarnings.next({
		..._poolWarnings.value,
		...warningsMap,
	})
}

export const fetchAndSetPoolWarnings = async (
	network: NetworkId,
	addresses: string[],
): Promise<void> => {
	// NOTE: pool warnings only availale on polkadot
	if (
		network !== 'polkadot' ||
		addresses.length === 0 ||
		!pluginEnabled('staking_api')
	) {
		return
	}

	const result = await fetchPoolWarnings(network, addresses)
	const warningsMap: Record<string, PoolWarning[]> = {}

	addresses.forEach((address) => {
		warningsMap[address] = [
			...result.destroyingPools
				.filter((m) => m.address === address)
				.map((m) => ({ ...m, type: 'destroying' as const })),
			...result.highCommissionPools
				.filter((m) => m.address === address)
				.map((m) => ({ ...m, type: 'highCommission' as const })),
		]
	})

	setPoolWarningsBatch(warningsMap)
}

export const resetPoolWarnings = (): void => {
	_poolWarnings.next(defaultPoolWarnings)
}
