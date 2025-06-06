// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Proxies } from 'types'
import { _proxies } from './private'

export const proxies$ = _proxies.asObservable()

export const resetProxies = () => {
  _proxies.next({})
}

export const getProxies = (address: string) =>
  _proxies.getValue()?.[address] || []

export const addProxies = (address: string, proxies: Proxies) => {
  const next = { ..._proxies.getValue() }
  next[address] = proxies
  _proxies.next(next)
}

export const removeProxies = (address: string) => {
  const next = { ..._proxies.getValue() }
  delete next[address]
  _proxies.next(next)
}
