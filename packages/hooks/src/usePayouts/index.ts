// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnclaimedRewards } from 'plugin-staking-api/types'
import { useCallback, useSyncExternalStore } from 'react'
import { defaultUnclaimedRewards } from './defaults'
import type { PayoutsHookInterface } from './types'

export { defaultUnclaimedRewards } from './defaults'
export type { PayoutsHookInterface } from './types'

const listeners = new Set<() => void>()
let currentUnclaimedRewards: UnclaimedRewards = defaultUnclaimedRewards

const emitPayoutsChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const subscribePayouts = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

const getUnclaimedRewardsSnapshot = () => currentUnclaimedRewards

const setUnclaimedRewardsState = (unclaimedRewards: UnclaimedRewards) => {
	currentUnclaimedRewards = unclaimedRewards
	emitPayoutsChange()
}

export const usePayouts = (): PayoutsHookInterface => {
	const unclaimedRewards = useSyncExternalStore(
		subscribePayouts,
		getUnclaimedRewardsSnapshot,
		getUnclaimedRewardsSnapshot,
	)

	const setUnclaimedRewards = useCallback(
		(unclaimedRewards: UnclaimedRewards) => {
			setUnclaimedRewardsState(unclaimedRewards)
		},
		[],
	)

	return {
		unclaimedRewards,
		setUnclaimedRewards,
	}
}
