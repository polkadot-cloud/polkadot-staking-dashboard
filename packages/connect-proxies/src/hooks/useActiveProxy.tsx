// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react'
import { activeProxy$ } from '../state/activeProxy'
import { _activeProxy } from '../state/activeProxy.private'
import type { ActiveProxy } from '../types'

// Subscribes to the active proxy observable and returns the current value.
export const useActiveProxy = () => {
	const [activeProxy, setActiveProxy] = useState<ActiveProxy | null>(
		_activeProxy.getValue(),
	)

	useEffect(() => {
		const sub = activeProxy$.subscribe(setActiveProxy)
		return () => {
			sub.unsubscribe()
		}
	}, [])

	return activeProxy
}
