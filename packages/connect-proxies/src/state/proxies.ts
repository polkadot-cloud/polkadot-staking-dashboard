// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ProxyRecord } from '../types'
import { _proxies } from './proxies.private'

export const proxies$ = _proxies.asObservable()

export const resetProxies = () => {
	_proxies.next({})
}

export const getProxies = (address: string): ProxyRecord | undefined =>
	_proxies.getValue()?.[address]

export const addProxies = (address: string, record: ProxyRecord) => {
	const next = { ..._proxies.getValue() }
	next[address] = record
	_proxies.next(next)
}

export const removeProxies = (address: string) => {
	const next = { ..._proxies.getValue() }
	delete next[address]
	_proxies.next(next)
}
