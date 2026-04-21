// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { GenericSubstrateApi } from 'dedot/types'
import { useEffect, useState } from 'react'
import { useProxiesContext } from '../Provider'
import { proxies$ } from '../state/proxies'
import type { ProxyRecord } from '../types'

// Lazily starts proxy discovery when api is provided, and tears down when the
// last consumer unmounts or the api reference changes.
export const useProxies = <T extends GenericSubstrateApi>(
	api: DedotClient<T> | null | undefined,
) => {
	const { controller } = useProxiesContext()
	const [proxies, setProxies] = useState<Record<string, ProxyRecord>>({})

	useEffect(() => {
		const sub = proxies$.subscribe(setProxies)
		return () => {
			sub.unsubscribe()
		}
	}, [])

	useEffect(() => {
		if (!api) return
		controller.start(api)
		return () => {
			controller.stop()
		}
	}, [api, controller])

	return proxies
}
