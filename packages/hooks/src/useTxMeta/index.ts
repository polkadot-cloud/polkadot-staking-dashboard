// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { uids$ } from 'global-bus'
import { useCallback, useSyncExternalStore } from 'react'
import type { TxSubmissionItem } from 'types'
import { createObservableStore } from 'utils'
import type { TxMetaContextInterface } from './types'

const uidsStore = createObservableStore<TxSubmissionItem[]>(uids$, [])

export const useTxMeta = (): TxMetaContextInterface => {
	const uids = useSyncExternalStore(
		uidsStore.subscribe,
		uidsStore.getSnapshot,
		uidsStore.getSnapshot,
	)

	const getTxSubmission = useCallback(
		(uid?: number) => uids.find((item) => item.uid === uid),
		[uids],
	)

	const getTxSubmissionByTag = useCallback(
		(tag: string) => uids.find((item) => item.tag === tag),
		[uids],
	)

	return {
		uids,
		getTxSubmission,
		getTxSubmissionByTag,
	}
}
