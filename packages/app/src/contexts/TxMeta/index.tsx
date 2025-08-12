// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { uids$ } from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { TxSubmissionItem } from 'types'
import type { TxMetaContextInterface } from './types'

export const [TxMetaContext, useTxMeta] =
	createSafeContext<TxMetaContextInterface>()

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
	// Store uids of transactions, along with their status
	const [uids, setUids] = useState<TxSubmissionItem[]>([])

	// Get a tx submission
	const getTxSubmission = (uid?: number) =>
		uids.find((item) => item.uid === uid)

	// Get a tx submission by tag
	const getTxSubmissionByTag = (tag?: string) =>
		uids.find((item) => item.tag === tag)

	// Subscribe to global bus tx submission
	useEffect(() => {
		const subUids = uids$.subscribe((result) => {
			setUids(result)
		})
		return () => {
			subUids.unsubscribe()
		}
	}, [])

	return (
		<TxMetaContext.Provider
			value={{
				uids,
				getTxSubmission,
				getTxSubmissionByTag,
			}}
		>
			{children}
		</TxMetaContext.Provider>
	)
}
