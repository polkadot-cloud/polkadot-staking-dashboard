// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { uids$ } from 'global-bus'
import { useCallback, useEffect, useState } from 'react'
import type { TxSubmissionItem } from 'types'
import type { TxMetaHookInterface } from './types'

export const useTxMeta = (): TxMetaHookInterface => {
	const [uids, setUids] = useState<TxSubmissionItem[]>([])

	// Subscribe to the global uids$ bus so this hook always reflects the latest state of in-flight
	// and completed transactions. The subscription is cleaned up when the calling component unmounts.
	useEffect(() => {
		const subscription = uids$.subscribe((result) => {
			setUids(result)
		})
		return () => subscription.unsubscribe()
	}, [])

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
