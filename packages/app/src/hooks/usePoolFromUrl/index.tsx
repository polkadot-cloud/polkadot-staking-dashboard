// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useApi } from 'contexts/Api'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { emitNotification } from 'global-bus'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'

export const usePoolFromUrl = () => {
	const { t } = useTranslation('app')
	const { isReady } = useApi()
	const { search } = useLocation()
	const { openCanvas, setCanvasConfig, status } = useOverlay().canvas
	const { bondedPools } = useBondedPools()

	// Track the pool id that was last opened from a URL param
	const openedRef = useRef<string | null>(null)

	useEffect(() => {
		if (!isReady || bondedPools.length === 0) {
			return
		}

		const poolId = extractUrlValue('p')
		if (!poolId || poolId === openedRef.current) {
			return
		}

		const id = Number(poolId)
		if (isNaN(id)) {
			emitNotification({
				title: t('invalidPoolId'),
				subtitle: `${t('poolNotFound')}: ${poolId}`,
			})
			openedRef.current = poolId
			return
		}

		const pool = bondedPools.find((bp) => Number(bp.id) === id)
		if (!pool) {
			emitNotification({
				title: t('invalidPoolId'),
				subtitle: `${t('poolNotFound')}: ${poolId}`,
			})
			openedRef.current = poolId
			return
		}

		const config = {
			key: 'Pool',
			options: {
				providedPool: {
					id,
				},
			},
			size: 'xl' as const,
		}

		openedRef.current = poolId

		// If canvas is already open, swap the content in place
		if (status === 'open') {
			setCanvasConfig(config)
		} else if (status === 'closed') {
			openCanvas(config)
		}
	}, [isReady, bondedPools.length, search, status])
}
