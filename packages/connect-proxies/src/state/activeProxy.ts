// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setLocalActiveProxy } from '../persistence/activeProxy'
import type { ActiveProxy } from '../types'
import { _activeProxy } from './activeProxy.private'

export const activeProxy$ = _activeProxy.asObservable()

export const getActiveProxy = () => _activeProxy.getValue()

export const setActiveProxy = (network: string, proxy: ActiveProxy | null) => {
	setLocalActiveProxy(network, proxy)
	_activeProxy.next(proxy)
}

export const resetActiveProxy = () => {
	_activeProxy.next(null)
}
