// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { uids$ } from 'global-bus'
import { useCallback, useEffect, useState } from 'react'
import type { TxSubmissionItem } from 'types'
import type { TxMetaHookInterface } from './types'

export const useTxMeta = (): TxMetaHookInterface => {
	const [uids, setUids] = useState<TxSubmissionItem[]>([])

	useEffect(() => {
		const subscription = uids$.subscribe((result) => {
			setUids(result)
		})
		return () => subscription.unsubscribe()
	}, [])

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
