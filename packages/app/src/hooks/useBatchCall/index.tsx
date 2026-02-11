// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import type { SubmittableExtrinsic } from 'dedot'
import { useProxySupported } from 'hooks/useProxySupported'
import type { ActiveProxy, MaybeAddress } from 'types'

export const useBatchCall = () => {
	const { serviceApi } = useApi()
	const { isProxySupported } = useProxySupported()

	const newBatchCall = (
		txs: SubmittableExtrinsic[],
		from: MaybeAddress,
		activeProxy: ActiveProxy | null,
	): SubmittableExtrinsic | undefined => {
		from = from || ''
		const batchTx = serviceApi.tx.batch(txs)
		// If the active proxy supports this call, wrap each batch call in a proxy call
		if (
			activeProxy &&
			batchTx &&
			isProxySupported(batchTx, from, activeProxy)
		) {
			return serviceApi.tx.batch(
				txs
					.map((tx) => serviceApi.tx.proxy(from, tx))
					.filter((tx) => tx !== undefined),
			)
		} else {
			return batchTx
		}
	}

	return {
		newBatchCall,
	}
}
