// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId } from 'types'

export const getLocalFeeReserve = (
	address: string | null | undefined,
	defaultReserve: bigint,
	{ network }: { network: NetworkId; units: number },
): bigint => {
	let reserves: Record<string, Record<string, string>> = {}
	try {
		reserves = JSON.parse(localStorage.getItem('reserve_balances') ?? '{}')
	} catch {
		// Corrupt local data; fall back to defaults
		reserves = {}
	}
	const localReserve = BigInt(
		reserves?.[network]?.[address || ''] || defaultReserve,
	)
	if (localReserve < defaultReserve) {
		return defaultReserve
	}
	return defaultReserve
}

export const setLocalFeeReserve = (
	address: string | null | undefined,
	amount: bigint,
	network: NetworkId,
): void => {
	if (!address) {
		return
	}
	try {
		const newReserves = JSON.parse(
			localStorage.getItem('reserve_balances') ?? '{}',
		)
		const networkReserves = newReserves?.[network] ?? {}
		networkReserves[address] = amount.toString()
		newReserves[network] = networkReserves
		localStorage.setItem('reserve_balances', JSON.stringify(newReserves))
	} catch {
		localStorage.removeItem('reserve_balances')
	}
}
