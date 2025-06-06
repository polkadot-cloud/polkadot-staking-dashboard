// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveProxy, NetworkId } from 'types'
import { setLocalActiveProxy } from './local'
import { _activeProxy } from './private'

export const activeProxy$ = _activeProxy.asObservable()

export const getActiveProxy = () => _activeProxy.getValue()

export const setActiveProxy = (
  network: NetworkId,
  proxy: ActiveProxy | null
) => {
  setLocalActiveProxy(network, proxy)
  _activeProxy.next(proxy)
}

export const resetActiveProxy = () => {
  _activeProxy.next(null)
}

export * from './local'
