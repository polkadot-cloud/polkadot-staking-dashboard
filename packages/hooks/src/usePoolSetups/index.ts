// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount, useImportedAccounts } from '@polkadot-cloud/connect'
import { unitToPlanck } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { MaybeAddress } from 'types'
import { useNetwork } from '../useNetwork'
import { defaultPoolProgress } from './defaults'
import { getLocalPoolSetups, setLocalPoolSetups } from './local'
import type {
	PoolProgress,
	PoolSetup,
	PoolSetups,
	PoolSetupsHookInterface,
} from './types'

export { defaultPoolProgress } from './defaults'
export type {
	PoolProgress,
	PoolSetup,
	PoolSetups,
	PoolSetupsHookInterface,
} from './types'

const listeners = new Set<() => void>()
let currentPoolSetups: PoolSetups = getLocalPoolSetups()

const emitPoolSetupsChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const getPoolSetupsSnapshot = () => currentPoolSetups
const getServerPoolSetupsSnapshot = (): PoolSetups => ({})

const setPoolSetups = (setups: PoolSetups) => {
	currentPoolSetups = setups
	setLocalPoolSetups(setups)
	emitPoolSetupsChange()
}

const syncPoolSetups = () => {
	const localSetups = getLocalPoolSetups()
	if (JSON.stringify(currentPoolSetups) !== JSON.stringify(localSetups)) {
		currentPoolSetups = localSetups
		emitPoolSetupsChange()
	}
}

const subscribePoolSetups = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const getDefaultPoolSetup = (): PoolSetup => ({
	progress: defaultPoolProgress,
	section: 1,
})

const updateSetups = (
	all: PoolSetups,
	progress: PoolProgress,
	address: string,
	maybeSection?: number,
) => {
	const current = { ...(all[address] || {}) }
	const section = maybeSection ?? current.section ?? 1

	all[address] = {
		...current,
		progress,
		section,
	}
	return all
}

const hasPositiveBond = (bond: string, units: number): boolean => {
	try {
		return BigInt(unitToPlanck(bond || '0', units).toString()) > 0n
	} catch {
		return false
	}
}

export const usePoolSetups = (): PoolSetupsHookInterface => {
	const { network } = useNetwork()
	const { activeAddress } = useActiveAccount()
	const { accounts, stringifiedAccountsKey } = useImportedAccounts()
	const { units } = getStakingChainData(network)
	const poolSetups = useSyncExternalStore(
		subscribePoolSetups,
		getPoolSetupsSnapshot,
		getServerPoolSetupsSnapshot,
	)

	const getPoolSetup = useCallback(
		(address: MaybeAddress): PoolSetup => {
			return address
				? poolSetups[address] || getDefaultPoolSetup()
				: getDefaultPoolSetup()
		},
		[poolSetups],
	)

	const setPoolSetup = useCallback(
		(progress: PoolProgress) => {
			if (!activeAddress) {
				return
			}
			setPoolSetups(
				updateSetups({ ...getPoolSetupsSnapshot() }, progress, activeAddress),
			)
		},
		[activeAddress],
	)

	const removePoolSetup = useCallback((address: MaybeAddress) => {
		setPoolSetups(
			Object.fromEntries(
				Object.entries(getPoolSetupsSnapshot()).filter(
					([key]) => key !== address,
				),
			),
		)
	}, [])

	const getPoolSetupPercent = useCallback(
		(address: MaybeAddress) => {
			if (!address) {
				return 0
			}
			const { progress } = getPoolSetup(address)

			const p = 25
			let percentage = 0
			if (progress.metadata !== '') {
				percentage += p
			}
			if (hasPositiveBond(progress?.bond || '0', units)) {
				percentage += p
			}
			if (progress.nominations.length) {
				percentage += p
			}
			if (progress.roles !== null) {
				percentage += p - 1
			}
			return percentage
		},
		[getPoolSetup, units],
	)

	const setPoolSetupSection = useCallback(
		(section: number) => {
			if (!activeAddress) {
				return
			}
			const poolSetupsSnapshot = getPoolSetupsSnapshot()
			setPoolSetups(
				updateSetups(
					{ ...poolSetupsSnapshot },
					poolSetupsSnapshot[activeAddress]?.progress ?? defaultPoolProgress,
					activeAddress,
					section,
				),
			)
		},
		[activeAddress],
	)

	useEffect(() => {
		if (accounts.length) {
			syncPoolSetups()
		}
	}, [activeAddress, accounts.length, network, stringifiedAccountsKey])

	return {
		getPoolSetup,
		setPoolSetup,
		removePoolSetup,
		getPoolSetupPercent,
		setPoolSetupSection,
	}
}
