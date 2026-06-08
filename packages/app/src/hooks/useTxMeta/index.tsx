// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { uids$ } from 'global-bus'
import { useCallback, useSyncExternalStore } from 'react'
import type { TxSubmissionItem } from 'types'
import type { TxMetaHookInterface } from './types'

// A single RxJS subscription shared across every hook instance. The current value is cached in a a
// module-level variable so useSyncExternalStore has a synchronous snapshot to read from. The
// subscription is reference-counted: created when the first component mounts and torn down when the
// last one unmounts, so no RxJS subscriber is held open while the hook has no consumers.
let currentUids: TxSubmissionItem[] = []
const uidsListeners = new Set<() => void>()
let uidsRxSubscription: { unsubscribe(): void } | null = null

function subscribeToUids(onStoreChange: () => void): () => void {
	if (uidsListeners.size === 0) {
		uidsRxSubscription = uids$.subscribe((result) => {
			currentUids = result
			for (const listener of uidsListeners) {
				listener()
			}
		})
	}
	uidsListeners.add(onStoreChange)
	return () => {
		uidsListeners.delete(onStoreChange)
		if (uidsListeners.size === 0) {
			uidsRxSubscription?.unsubscribe()
			uidsRxSubscription = null
		}
	}
}

export const useTxMeta = (): TxMetaHookInterface => {
	const uids = useSyncExternalStore(
		subscribeToUids,
		() => currentUids,
		() => currentUids,
	)

	// Wrap the lookup functions in useCallback so their references stay stable between renders.
	// Components and effects that depend on these won't re-run unnecessarily unless the uids array
	// itself changes.
	const getTxSubmission = useCallback(
		(uid?: number) => uids.find((item) => item.uid === uid),
		[uids],
	)

	const getTxSubmissionByTag = useCallback(
		(tag?: string) => uids.find((item) => item.tag === tag),
		[uids],
	)

	return {
		uids,
		getTxSubmission,
		getTxSubmissionByTag,
	}
}
